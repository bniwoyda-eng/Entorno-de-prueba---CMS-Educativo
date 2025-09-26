import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { S3Module, EducatorModule, AuthModule } from 'src/exports/modules';
import { PostCommentController, PostCommentService } from './comments';
import { Post, PostComment, PostImage, PostTag } from './entities';
import { Educator, Tag } from 'src/exports/entities';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Post,
      PostTag,
      PostComment,
      PostImage,
      Tag,
      Educator,
    ]),
    S3Module,
    EducatorModule,
  ],
  controllers: [PostController, PostCommentController],
  providers: [PostService, PostCommentService],
})
export class PostModule { }
