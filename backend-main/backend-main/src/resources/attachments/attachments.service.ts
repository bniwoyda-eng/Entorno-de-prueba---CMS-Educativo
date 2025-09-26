import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateResourceAttachmentDto, UpdateResourceAttachmentDto } from '../dto';
import { PaginatedResponse, PaginationDto } from 'src/common';
import { ResourceAttachment } from '../entities';

@Injectable()
export class AttachmentsService {

    constructor(
        @InjectRepository(ResourceAttachment)
        private attachmentRepo: Repository<ResourceAttachment>,
    ) { }

    async create(resourceId: string, dto: CreateResourceAttachmentDto): Promise<ResourceAttachment> {
        const attachment = this.attachmentRepo.create({ ...dto, resource: { id: resourceId } });
        return await this.attachmentRepo.save(attachment);
    }

    async findAll(resourceId: string, dto: PaginationDto): Promise<PaginatedResponse<ResourceAttachment>> {
        const { page, limit } = dto;

        const [data, total] = await this.attachmentRepo.findAndCount({
            where: { resource: { id: resourceId } },
            order: { creation_date: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
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

    async findOne(resourceId: string, attachmentId: string): Promise<ResourceAttachment> {
        const attachment = await this.attachmentRepo.findOne({ where: { id: attachmentId, resource: { id: resourceId } } });
        if (!attachment) throw new NotFoundException(`ResourceAttachment with ID ${attachmentId} not found`);
        return attachment;
    }

    async update(resourceId: string, attachmentId: string, dto: UpdateResourceAttachmentDto): Promise<ResourceAttachment> {
        const attachment = await this.findOne(resourceId, attachmentId);
        Object.assign(attachment, dto);
        return await this.attachmentRepo.save(attachment);
    }

    async remove(resourceId: string, attachmentId: string): Promise<string> {
        const attachment = await this.findOne(resourceId, attachmentId);
        attachment.delete_date = new Date();
        await this.attachmentRepo.save(attachment);
        return `ResourceAttachment with ID ${attachmentId} deleted successfully`;
    }
}
