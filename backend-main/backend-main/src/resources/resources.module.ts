import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Educator } from 'src/exports/entities';
import { Resource, ResourceAttachment, ResourceComment } from './entities';
import { ResourcesController, ResourcesService, AttachmentsController, AttachmentsService, CommentsController, CommentsService } from './index';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([Resource, ResourceAttachment, ResourceComment, Educator ]),
  ],
  controllers: [ResourcesController, AttachmentsController, CommentsController],
  providers: [ResourcesService, AttachmentsService, CommentsService],
})
export class ResourcesModule { }
