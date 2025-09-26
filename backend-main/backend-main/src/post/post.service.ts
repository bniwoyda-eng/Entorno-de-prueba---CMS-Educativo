import { DataSource, In, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { S3Service, EducatorService } from 'src/exports/services';
import { Post, PostComment, PostImage, PostTag } from './entities';
import { CreatePostDto, PostsQueryDto } from './dto';
import { Educator, Tag, User } from 'src/exports/entities';
import { SlugAdapter } from 'src/utils';
import { PaginatedResponse } from 'src/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { POST_EVENTS } from './post.events';

export interface PostWithImagesAndTags extends Post {
  images: PostImage[];
  tags: Tag[];
}

@Injectable()
export class PostService {
  constructor(
    private readonly eventEmitter: EventEmitter2,

    private readonly dataSource: DataSource,

    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(PostTag) private postTagRepository: Repository<PostTag>,
    @InjectRepository(PostImage) private postImageRepository: Repository<PostImage>,
    @InjectRepository(PostImage) private postCommentRepository: Repository<PostComment>,

    private readonly s3Service: S3Service,
    private readonly educatorService: EducatorService,
  ) { }

  async create(user: User, files: Express.Multer.File[], dto: CreatePostDto): Promise<PostWithImagesAndTags> {

    // Verificamos que el usuario tenga un educador asociado
    const educator = await this.educatorService.findByUserId(user.id);
    if (!educator) throw new UnauthorizedException('User does not have an associated educator');

    // Primero subimos las imágenes a S3
    const uploadedFiles = await Promise.all(
      files.map(async (file) => {
        const uploadResult = await this.s3Service.uploadImage(file, 'posts');
        return { file, uploadResult };
      })
    );

    // Creamos una transacción para asegurar la atomicidad de la operación
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      // Guardamos el post
      const post = this.postRepository.create({ ...dto, views: 0, educator });
      const savedPost = await queryRunner.manager.save(post);

      // Guardamos las imágenes en la base de datos
      const images: PostImage[] = [];
      for (const { file, uploadResult } of uploadedFiles) {
        const postImage = this.postImageRepository.create({
          post: savedPost,
          imageKey: uploadResult.key,
          originalName: file.originalname,
          slug: SlugAdapter.generate(file.originalname),
          size: file.size,
          mimeType: file.mimetype,
        });
        const savedImage = await queryRunner.manager.save(postImage);
        delete savedImage.post;
        images.push({ ...savedImage, imageKey: uploadResult.url } as PostImage);
      }

      // Guardamos las etiquetas en la base de datos
      const tags: Tag[] = [];
      const { tagsIds = [] } = dto;
      if (tagsIds.length > 0) {
        for (const tagId of tagsIds) {
          await queryRunner.manager.save(this.postTagRepository.create({
            post: savedPost,
            tag: { id: tagId },
          }));
        }
        const foundTags = await queryRunner.manager.findBy(Tag, { id: In(tagsIds) });
        tags.push(...foundTags);
      }

      // Commiteamos la transacción
      await queryRunner.commitTransaction();

      // Emitimos el evento de post creado
      this.eventEmitter.emit(POST_EVENTS.POST_CREATED, { authorId: educator.id });

      return { ...savedPost, images, tags };
    } catch (err) {
      await queryRunner.rollbackTransaction();

      for (const { uploadResult } of uploadedFiles) {
        try {
          await this.s3Service.deleteFile(uploadResult.key);
        } catch (cleanupError) {
          console.warn('Failed to clean up file:', uploadResult.key);
        }
      }

      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(user: User, dto: PostsQueryDto): Promise<PaginatedResponse<PostWithImagesAndTags>> {

    // Verificamos que el usuario tenga un educador asociado
    const educator = await this.educatorService.findByUserId(user.id);
    if (!educator) throw new UnauthorizedException('User does not have an associated educator');

    const { page, limit, tag } = dto;
    const [data, total] = await this.postRepository.findAndCount({
      where: { educator: { institution: { id: educator.institution.id } }, postTags: { tag: { id: tag } } },
      relations: { educator: true, postImages: true, postTags: true, },
      order: { creation_date: 'DESC', },
      skip: (page - 1) * limit,
      take: limit,
    });

    const formattedData = await Promise.all(
      data.map(async (post) => {
        const formattedPost = await this.formatPost(post);
        return formattedPost;
      })
    );

    return {
      data: formattedData,
      meta: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(user: User, id: string): Promise<PostWithImagesAndTags> {

    // Verificamos que el usuario tenga un educador asociado
    const educator = await this.educatorService.findByUserId(user.id);
    if (!educator) throw new UnauthorizedException('User does not have an associated educator');

    const post = await this.postRepository.findOne({
      where: { id, educator: { institution: { id: educator.institution.id } } },
      relations: { educator: true, postImages: true, postTags: true },
    });
    if (!post) throw new UnauthorizedException(`Post with ID ${id} not found`);

    // Enviamos el evento de post visto
    this.eventEmitter.emit(POST_EVENTS.VIEWED, { postId: id });

    return await this.formatPost(post);;
  }

  async suggestedPosts(user: User, count: number): Promise<Post[]> {
    const educator = await this.educatorService.findByUserId(user.id);
    if (!educator) throw new UnauthorizedException('User does not have an associated educator');
    const { institution, id } = educator;

    // Paso 1: Obtener más posts de los necesarios 
    const potentialPosts = await this.postRepository.find({
      where: {
        educator: { id: Not(id), institution: { id: institution.id } },
      },
      select: ['id', 'title', 'creation_date', 'views', 'replies'],
      order: { creation_date: 'DESC' },
      take: 30
    });

    // Paso 2: Orden aleatorio
    const randomized = shuffleArray(potentialPosts);

    // Paso 3: Devolver los primeros N
    return randomized.slice(0, count);
  }

  async remove(user: User, id: string): Promise<void> {
    try {
      // Verificamos que el usuario tenga un educador asociado
      const educator = await this.educatorService.findByUserId(user.id);
      if (!educator) throw new UnauthorizedException('User does not have an associated educator');

      // Verificamos que el post exista
      const post = await this.postRepository.findOne({
        where: { id, educator: { id: educator.id } }
      });
      if (!post) throw new UnauthorizedException(`Post with ID ${id} not found`);

      // Borramos el post
      post.delete_date = new Date();
      await this.postRepository.save(post);

      // Emitimos el evento de post eliminado
      this.eventEmitter.emit(POST_EVENTS.POST_DELETED, { authorId: educator.id });

    } catch (error) {
      console.error('Error deleting post:', error);
      throw new UnauthorizedException(`Post with ID ${id} not found`);
    }
  }

  async getAuthorProfile(user: User, authorId: string): Promise<{ educator: Educator; posts: PostWithImagesAndTags[] }> {
    // Verificamos que el usuario tenga un educador asociado
    const educator = await this.educatorService.findByUserId(user.id);
    if (!educator) throw new UnauthorizedException('User does not have an associated educator');
    const { id: institutionId } = educator.institution;

    const author = await this.educatorService.findOneFromInstitution(authorId, institutionId);
    if (!author) throw new UnauthorizedException(`Educator with ID ${authorId} not found`);

    const posts = await this.postRepository.find({
      where: { educator: { id: authorId, institution: { id: institutionId } } },
      relations: { educator: true, postImages: true, postTags: true },
      order: { creation_date: 'DESC' },
    });

    const formattedPosts = await Promise.all(
      posts.map(async (post) => {
        const formattedPost = await this.formatPost(post);
        return formattedPost;
      }
      ));

    return { educator: author, posts: formattedPosts };
  }


  private async formatPost(post: Post): Promise<PostWithImagesAndTags> {
    const { postImages = [], postTags = [], ...postData } = post;

    const images: PostImage[] = await Promise.all(
      postImages.map(async (image) => ({
        ...image,
        imageKey: await this.s3Service.getPresignedUrl(image.imageKey),
      }))
    );

    const tags: Tag[] = postTags.map((pt) => pt.tag);

    return { ...(postData as Post), images, tags };
  }

  @OnEvent(POST_EVENTS.COMMENT_CREATED)
  async handlePostCommentCreatedEvent(event: { postId: string }) {
    const { postId } = event;
    await this.postRepository.increment({ id: postId }, 'replies', 1);
  }

  @OnEvent(POST_EVENTS.COMMENT_DELETED)
  async handlePostCommentDeletedEvent(event: { postId: string }) {
    const { postId } = event;
    // Controlar que no se pase a negativo
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) throw new UnauthorizedException(`Post with ID ${postId} not found`);
    if (post.replies <= 0) return;
    // Decrementar el contador de comentarios
    await this.postRepository.decrement({ id: postId }, 'replies', 1);
  }

  @OnEvent(POST_EVENTS.POST_CREATED)
  async handlePostCreatedEvent(event: { authorId: string }) {
    const { authorId } = event;
    await this.educatorService.incrementTotalPosts(authorId);
  }

  @OnEvent(POST_EVENTS.POST_DELETED)
  async handlePostDeletedEvent(event: { authorId: string }) {
    const { authorId } = event;
    await this.educatorService.decrementTotalPosts(authorId);
  }

  @OnEvent(POST_EVENTS.VIEWED)
  async handlePostViewedEvent(event: { postId: string }) {
    const { postId } = event;
    await this.postRepository.increment({ id: postId }, 'views', 1);
  }
}

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}