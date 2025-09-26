import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateResourceCommentDto } from '../dto';
import { ResourceComment } from '../entities';
import { PaginatedResponse, PaginationDto } from 'src/common';
import { Educator } from 'src/exports/entities';

@Injectable()
export class CommentsService {

    constructor(
        @InjectRepository(ResourceComment)
        private commentRepo: Repository<ResourceComment>, 
        @InjectRepository(Educator)
        private educatorRepo: Repository<Educator>, 
    ) { }

    async create(userId: string, resourceId: string, dto: CreateResourceCommentDto) {

        const educatorDB = await this.educatorRepo.findOne({ where: { user: { id: userId } } });
        if (!educatorDB) throw new NotFoundException(`Educator with ID ${userId} not found`);

        const item = this.commentRepo.create({ ...dto, resource: { id: resourceId }, educator: { id: educatorDB.id } });
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
        if (!comment) throw new NotFoundException(`ResourceComment with ID ${item.id} not found`);
        const { educator, ...rest } = comment;
        return {
            ...rest,
            educator: {
                id: educator.id,
                fullName: educator.fullName,
            },
        };
    }

    async findAllByResource(resourceId: string, pagination: PaginationDto): Promise<PaginatedResponse<ResourceComment>> {
        const { limit, page } = pagination;
        const [data, total] = await this.commentRepo.findAndCount({
            where: { resource: { id: resourceId } },
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

    async findOne(resourceId: string, commentId: string, userId?: string): Promise<ResourceComment> {
        const where = { id: commentId, resource: { id: resourceId } };
        if (userId) { where['educator'] = { id: userId }; }
        const comment = await this.commentRepo.findOne({ where });
        if (!comment) throw new NotFoundException(`ResourceComment with ID ${commentId} not found`);
        return comment;
    }

    async remove(userId: string, resourceId: string, commentId: string): Promise<string> {
        const educatorDB = await this.educatorRepo.findOne({ where: { user: { id: userId } } });
        if (!educatorDB) throw new NotFoundException(`Educator with ID ${userId} not found`);

        const comment = await this.findOne(resourceId, commentId, educatorDB.id);
        comment.delete_date = new Date();
        await this.commentRepo.save(comment);
        return `ResourceComment with ID ${commentId} deleted successfully`;
    }
}
