import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, Like, In } from 'typeorm';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';
import { Lesson } from './entities/lessons.entity';
import { Course } from 'src/courses/entities/courses.entity';
import { AbstractResponse, AbstractPaginationResponse } from 'src/common/interfaces';
import { SearchLessonsDto } from './dtos';
import { Material } from 'src/materials/entities';
import { CoursesService } from 'src/courses/courses.service';
import { Student } from 'src/exports/entities';

@Injectable()
export class LessonsService {
    constructor(
        private readonly coursesService: CoursesService,
        @InjectRepository(Lesson)
        private readonly lessonsRepository: Repository<Lesson>,
        @InjectRepository(Course)
        private readonly coursesRepository: Repository<Course>,
        @InjectRepository(Student)
        private readonly studentsRepository: Repository<Student>,
        @InjectRepository(Material)
        private readonly materialsRepository: Repository<Material>
    ) {}

    async updateLessonDurationAndMaterialCount(materialId: string, isDeleted: boolean = false): Promise<void> {
        const material = await this.materialsRepository.findOne({
            where: { id: materialId },
            relations: ['lesson', 'lesson.course'],
            withDeleted: true,
        });
        if (material && material.lesson) {
            const lesson = material.lesson;
            if (isDeleted) {
                // If the material has been removed, subtract its duration and decrement the material counter
                lesson.totalDuration -= material.duration || 0;
                lesson.materialCount -= 1;
            } else {
                // If the material has been created or updated, recalculate the total duration and material counter
                const materials = await this.materialsRepository.find({ where: { lesson: { id: lesson.id } } });
                lesson.totalDuration = materials.reduce((sum, mat) => sum + (mat.duration || 0), 0);
                lesson.materialCount = materials.length;
            }
            await this.lessonsRepository.save(lesson);
            await this.coursesService.updateCourseDuration(lesson.course.id);
        }
    }

    async create(createLessonDto: CreateLessonDto): Promise<AbstractResponse<Lesson>> {
        const course = await this.coursesRepository.findOne({ where: { id: createLessonDto.courseId } });
        if (!course) {
            throw new NotFoundException(`Course with ID ${createLessonDto.courseId} not found`);
        }

        const sequence = await this.getValidSequence(createLessonDto.sequence, createLessonDto.courseId);

        const newLesson = this.lessonsRepository.create({ ...createLessonDto, sequence, course });
        const savedLesson = await this.lessonsRepository.save(newLesson);
        await this.coursesService.updateCourseLessonCount(course.id);
        return {
            code: savedLesson ? 200 : 500,
            result: savedLesson ? 'success' : 'error',
            payload: {
                data: savedLesson,
            },
        };
    }

    async findAll(searchLessonsDto: SearchLessonsDto): Promise<AbstractPaginationResponse<Lesson[]>> {
        const { page, limit, courseId, title, sequence } = searchLessonsDto;
        const where: FindManyOptions<Lesson>['where'] = {};

        if (courseId) {
            where.course = { id: courseId };
        }

        if (title) {
            where.title = Like(`%${title}%`);
        }

        if (sequence) {
            where.sequence = sequence;
        }

        const [result, total] = await this.lessonsRepository.findAndCount({
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

    async findOne(id: string): Promise<AbstractResponse<Lesson>> {
        const lesson = await this.lessonsRepository.findOne({ where: { id } });
        if (!lesson) {
            throw new NotFoundException(`Lesson with ID ${id} not found`);
        }
        return {
            code: 200,
            result: 'success',
            payload: {
                data: lesson,
            },
        };
    }

    async update(id: string, updateLessonDto: UpdateLessonDto): Promise<AbstractResponse<Lesson>> {
        const existingLesson = await this.lessonsRepository.findOne({ where: { id } });
        if (!existingLesson) {
            throw new NotFoundException(`Lesson with ID ${id} not found`);
        }

        const course = await this.coursesRepository.findOne({ where: { id: updateLessonDto.courseId } });
        if (!course) {
            throw new NotFoundException(`Course with ID ${updateLessonDto.courseId} not found`);
        }

        const sequence = await this.getValidSequence(
            updateLessonDto.sequence,
            updateLessonDto.courseId,
            existingLesson.sequence
        );

        const updatedLesson = this.lessonsRepository.merge(existingLesson, { ...updateLessonDto, sequence, course });
        const savedLesson = await this.lessonsRepository.save(updatedLesson);
        return {
            code: 200,
            result: 'success',
            payload: {
                data: savedLesson,
            },
        };
    }

    async remove(id: string): Promise<AbstractResponse<Lesson>> {
        const lesson = await this.lessonsRepository.findOne({ where: { id } });
        if (!lesson) {
            throw new NotFoundException(`Lesson with ID ${id} not found`);
        }
        await this.lessonsRepository.softRemove(lesson);
        await this.coursesService.updateCourseLessonCount(lesson.course.id);
        return {
            code: 200,
            result: 'success',
            payload: {
                data: lesson,
            },
        };
    }

    private async getValidSequence(sequence?: number, courseId?: string, currentSequence?: number): Promise<number> {
        if (sequence && sequence !== currentSequence) {
            const existingLesson = await this.lessonsRepository.findOne({
                where: { sequence, course: { id: courseId } },
            });
            if (existingLesson) {
                throw new BadRequestException(`Sequence ${sequence} is already in use for this course.`);
            }
            return sequence;
        } else if (!sequence) {
            const maxSequence = await this.lessonsRepository
                .createQueryBuilder('lesson')
                .select('MAX(lesson.sequence)', 'max')
                .where('lesson.courseId = :courseId', { courseId })
                .getRawOne();
            return (maxSequence.max || 0) + 1;
        }
        return currentSequence;
    }
}
