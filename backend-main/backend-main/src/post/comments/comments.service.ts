import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';

import { CreatePostCommentDto } from '../dto';
import { Post, PostComment } from '../entities';
import { PaginatedResponse, PaginationDto } from 'src/common';
import { EducatorService } from 'src/educator/educator.service';
import { Educator, User } from 'src/exports/entities';
import { POST_EVENTS } from '../post.events';

@Injectable()
export class PostCommentService {

    constructor(
        private readonly eventEmitter: EventEmitter2,
        private readonly educatorService: EducatorService,

        @InjectRepository(Post)
        private postRepo: Repository<Post>,
        @InjectRepository(PostComment)
        private commentRepo: Repository<PostComment>,
        @InjectRepository(Educator)
        private educatorRepo: Repository<Educator>,
    ) { }

    async create(user: User, postId: string, dto: CreatePostCommentDto) {

        // Verificamos que el usuario tenga un educador asociado
        const educatorDB = await this.educatorService.findByUserId(user.id);
        if (!educatorDB) throw new UnauthorizedException('User does not have an associated educator');
        // const { institution } = educatorDB;

        // const post = await this.postRepo.findOne({ where: { id: postId, educator: { institution } } });
        // if (!post) throw new NotFoundException(`Post with ID ${postId} not found`); 

        const item = this.commentRepo.create({ ...dto, post: { id: postId }, educator: { id: educatorDB.id } });
        await this.commentRepo.save(item);
        const comment = await this.commentRepo.findOne({
            where: { id: item.id },
            relations: ['educator'],
            select: {
                id: true,
                comment: true,
                creation_date: true,
                educator: {
                    id: true,
                    fullName: true,
                },
            },
        });
        if (!comment) throw new NotFoundException(`PostComment with ID ${item.id} not found`);

        // Emitimos el evento de creación de comentario
        this.eventEmitter.emit(POST_EVENTS.COMMENT_CREATED, { postId: postId });

        const { educator, ...rest } = comment;
        return {
            ...rest,
            educator: {
                id: educator.id,
                fullName: educator.fullName,
            },
        };
    }

    async findAllByPost(postId: string, pagination: PaginationDto): Promise<PaginatedResponse<PostComment>> {
        const { limit, page } = pagination;
        const [data, total] = await this.commentRepo.findAndCount({
            where: { post: { id: postId } },
            relations: ['educator'],
            select: {
                id: true,
                comment: true,
                creation_date: true,
                educator: {
                    id: true,
                    fullName: true,
                    profilePicture: true,
                },
            },
            order: { creation_date: 'DESC' },
            take: limit,
            skip: (page - 1) * limit,
        });

        return {
            data,
            meta: {
                totalItems: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(postId: string, commentId: string, userId?: string): Promise<PostComment> {
        const where = { id: commentId, post: { id: postId } };
        if (userId) { where['educator'] = { id: userId }; }
        const comment = await this.commentRepo.findOne({ where });
        if (!comment) throw new NotFoundException(`PostComment with ID ${commentId} not found`);
        return comment;
    }

    async remove(userId: string, postId: string, commentId: string): Promise<string> {
        const educatorDB = await this.educatorRepo.findOne({ where: { user: { id: userId } } });
        if (!educatorDB) throw new NotFoundException(`Educator with ID ${userId} not found`);

        const comment = await this.findOne(postId, commentId, educatorDB.id);
        comment.delete_date = new Date();
        await this.commentRepo.save(comment);

        // Emitimos el evento de eliminación de comentario
        this.eventEmitter.emit(POST_EVENTS.COMMENT_DELETED, { postId: postId });

        return `PostComment with ID ${commentId} deleted successfully`;
    }
}
