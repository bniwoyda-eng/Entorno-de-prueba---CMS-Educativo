import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like, Not, In } from 'typeorm';
import { CreateMaterialDto } from './dtos/create-material.dto';
import { UpdateMaterialDto } from './dtos/update-material.dto';
import { Material } from './entities/materials.entity';
import { Lesson } from 'src/lessons/entities/lessons.entity';
import { AbstractResponse, AbstractPaginationResponse } from 'src/common/interfaces';
import { SearchMaterialsDto } from './dtos/search-materials.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MaterialCreatedEvent, MaterialDeletedEvent, MaterialUpdatedEvent } from './events/materials.events';
import { Student } from 'src/exports/entities';
import { MaterialType } from './enums';

@Injectable()
export class MaterialsService {
    constructor(
        private eventEmitter: EventEmitter2,
        @InjectRepository(Material)
        private readonly materialsRepository: Repository<Material>,
        @InjectRepository(Lesson)
        private readonly lessonsRepository: Repository<Lesson>,
        @InjectRepository(Student)
        private readonly studentsRepository: Repository<Student>
    ) {}

    async create(createMaterialDto: CreateMaterialDto): Promise<AbstractResponse<Material>> {
        const lesson = await this.lessonsRepository.findOne({ where: { id: createMaterialDto.lessonId } });
        if (!lesson) {
            throw new NotFoundException(`Lesson with ID ${createMaterialDto.lessonId} not found`);
        }

        await this.validateDuplicateMaterial(
            createMaterialDto.lessonId,
            createMaterialDto.type,
            createMaterialDto.title
        );

        const sequence = await this.getValidSequence(createMaterialDto.sequence, createMaterialDto.lessonId);

        const newMaterial = this.materialsRepository.create({ ...createMaterialDto, sequence, lesson: lesson });
        const savedMaterial = await this.materialsRepository.save(newMaterial);
        this.eventEmitter.emit('material.created', new MaterialCreatedEvent(savedMaterial.id));

        return {
            code: savedMaterial ? 200 : 500,
            result: savedMaterial ? 'success' : 'error',
            payload: {
                data: savedMaterial,
            },
        };
    }

    async findAll(searchMaterialsDto: SearchMaterialsDto): Promise<AbstractPaginationResponse<Material[]>> {
        const { page, limit, lessonId, title, sequence } = searchMaterialsDto;
        const where: FindManyOptions<Material>['where'] = {};

        if (lessonId) {
            where.lesson = { id: lessonId };
        }

        if (title) {
            where.title = Like(`%${title}%`);
        }

        if (sequence) {
            where.sequence = sequence;
        }

        const [result, total] = await this.materialsRepository.findAndCount({
            where,
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            code: total === 0 ? 404 : 200,
            result: total === 0 ? 'not found' : 'success',
            payload: {
                data: result,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string): Promise<AbstractResponse<Material>> {
        const material = await this.materialsRepository.findOne({ where: { id } });
        if (!material) {
            throw new NotFoundException(`Material with ID ${id} not found`);
        }
        return {
            code: 200,
            result: 'success',
            payload: {
                data: material,
            },
        };
    }

    async update(id: string, updateMaterialDto: UpdateMaterialDto): Promise<AbstractResponse<Material>> {
        const existingMaterial = await this.materialsRepository.findOne({ where: { id } });
        if (!existingMaterial) {
            throw new NotFoundException(`Material with ID ${id} not found`);
        }

        const lesson = await this.lessonsRepository.findOne({ where: { id: updateMaterialDto.lessonId } });
        if (!lesson) {
            throw new NotFoundException(`Lesson with ID ${updateMaterialDto.lessonId} not found`);
        }

        await this.validateDuplicateMaterial(
            updateMaterialDto.lessonId,
            updateMaterialDto.type,
            updateMaterialDto.title,
            id
        );

        const sequence = await this.getValidSequence(
            updateMaterialDto.sequence,
            updateMaterialDto.lessonId,
            existingMaterial.sequence
        );

        const updatedMaterial = this.materialsRepository.merge(existingMaterial, {
            ...updateMaterialDto,
            sequence,
            lesson: lesson,
        });
        const savedMaterial = await this.materialsRepository.save(updatedMaterial);
        this.eventEmitter.emit('material.updated', new MaterialUpdatedEvent(savedMaterial.id));

        return {
            code: 200,
            result: 'success',
            payload: {
                data: savedMaterial,
            },
        };
    }

    async remove(id: string): Promise<AbstractResponse<Material>> {
        const material = await this.materialsRepository.findOne({ where: { id } });
        if (!material) {
            throw new NotFoundException(`Material with ID ${id} not found`);
        }
        await this.materialsRepository.softRemove(material);
        this.eventEmitter.emit('material.deleted', new MaterialDeletedEvent(material.id));

        return {
            code: 200,
            result: 'success',
            payload: {
                data: material,
            },
        };
    }

    private async validateDuplicateMaterial(lessonId: string, type: MaterialType, title: string, id?: string): Promise<void> {
        const where: FindManyOptions<Material>['where'] = {
            lesson: { id: lessonId },
            type,
            title,
        };

        if (id) {
            where.id = Not(id);
        }

        const existingMaterial = await this.materialsRepository.findOne({ where });
        if (existingMaterial) {
            throw new BadRequestException(
                `Material with type "${type}" and title "${title}" already exists for this lesson.`
            );
        }
    }

    private async getValidSequence(sequence?: number, lessonId?: string, currentSequence?: number): Promise<number> {
        if (sequence && sequence !== currentSequence) {
            const existingMaterial = await this.materialsRepository.findOne({
                where: { sequence, lesson: { id: lessonId } },
            });
            if (existingMaterial) {
                throw new BadRequestException(`Sequence ${sequence} is already in use for this lesson.`);
            }
            return sequence;
        } else if (!sequence) {
            const maxSequence = await this.materialsRepository
                .createQueryBuilder('material')
                .select('MAX(material.sequence)', 'max')
                .where('material.lesson_Id = :lessonId', { lessonId })
                .getRawOne();
            return (maxSequence.max || 0) + 1;
        }
        return currentSequence;
    }
}
