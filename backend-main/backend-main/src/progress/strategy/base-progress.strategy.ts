// strategy/base-progress.strategy.ts
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { UpdateProgressDto } from '../dto/update-progress.dto';
import { MaterialType } from 'src/exports/enums';
import { Course, Material } from 'src/exports/entities';
import { CourseWithProgress, MaterialProgress, MaterialProgressResponse } from './progress-strategy.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MaterialCompletedEvent } from '../events';
import { ValidRoles } from 'src/auth';

interface IMaterialDetail {
    lastPosition: number;
    progressPercentage: number;
    score: number | null;
    material: Material;
}

interface IEnrollmentDetail {
    course: Course;
}

export abstract class BaseProgressStrategy<TPerson, TProgress extends IMaterialDetail, TEnrollment extends IEnrollmentDetail, TCourse extends Course = Course> {
    constructor(
        private eventEmitter: EventEmitter2,
        protected readonly personRepository: Repository<TPerson>,
        protected readonly progressRepository: Repository<TProgress>,
        protected readonly enrollmentsRepository: Repository<TEnrollment>,
        protected readonly coursesRepository: Repository<Course>,
    ) { }

    protected abstract getPersonWhereClause(userId: string): any;
    protected abstract createProgress(personId: string, materialId: string): Partial<TProgress>;
    protected abstract getPersonId(person: TPerson): string;
    protected abstract getPersonRelationField(): 'educator' | 'student';
    protected abstract getPersonRelationAlias(): 'educatorProgress' | 'studentProgress';

    async getGlobalProgress(userId: string): Promise<CourseWithProgress[]> {
        const person = await this.personRepository.findOne({ where: this.getPersonWhereClause(userId) });
        if (!person) throw new NotFoundException(`User with ID ${userId} not found`);

        const personId = this.getPersonId(person);
        const personRelationField = this.getPersonRelationField();
        const personRelationAlias = this.getPersonRelationAlias();

        const enrollments = await this.enrollmentsRepository.createQueryBuilder('enrollments')
            .where(`enrollments.${personRelationField} = :personId`, { personId })
            .leftJoinAndSelect('enrollments.course', 'course')
            .getMany();
        if (!enrollments.length) return [];

        const courseIds = enrollments.map(e => e.course.id);

        const courses = await this.coursesRepository.createQueryBuilder('course')
            .leftJoinAndSelect('course.lessons', 'lesson')
            .leftJoinAndSelect('lesson.materials', 'material')
            .leftJoinAndSelect(`material.${personRelationAlias}`, personRelationAlias, `${personRelationAlias}.${personRelationField} = :personId`, { personId })
            .where('course.id IN (:...courseIds)', { courseIds })
            .orderBy('course.sequence', 'ASC')
            .addOrderBy('lesson.sequence', 'ASC')
            .addOrderBy('material.sequence', 'ASC')
            .getMany();

        return courses.map(course => this.buildCourseProgress(course, personRelationAlias));
    }

    async getCourseProgress(userId: string, courseId: string): Promise<CourseWithProgress> {

        const person = await this.personRepository.findOne({ where: this.getPersonWhereClause(userId) });
        if (!person) throw new NotFoundException(`User with ID ${userId} not found`);

        const personId = this.getPersonId(person);
        const personRelationField = this.getPersonRelationField();
        const personRelationAlias = this.getPersonRelationAlias();

        const enrollment = await this.enrollmentsRepository.findOne({
            where: { [personRelationField]: { id: personId }, course: { id: courseId }, } as any,
        });
        if (!enrollment) throw new NotFoundException(`User with ID ${userId} is not enrolled in course with ID ${courseId}`);

        const course = await this.coursesRepository.createQueryBuilder('course')
            .where('course.id = :courseId', { courseId })
            .leftJoinAndSelect('course.lessons', 'lesson')
            .leftJoinAndSelect('lesson.materials', 'material')
            .leftJoinAndSelect(`material.${personRelationAlias}`, personRelationAlias, `${personRelationAlias}.${personRelationField} = :personId`, { personId })
            .orderBy('lesson.sequence', 'ASC')
            .addOrderBy('material.sequence', 'ASC')
            .getOne() as any;
        if (!course) throw new NotFoundException(`Course with ID ${courseId} not found`);

        return this.buildCourseProgress(course, personRelationAlias, true);

    }

    async getMaterialProgress(userId: string, materialId: string): Promise<TProgress> {
        const person = await this.personRepository.findOne({ where: this.getPersonWhereClause(userId) });
        if (!person) throw new NotFoundException(`User with ID ${userId} not found`);
        const personId = this.getPersonId(person);

        const existingProgress = await this.progressRepository.findOne({
            where: {
                [this.getPersonRelationField()]: { id: personId },
                material: { id: materialId },
            } as any,
        });

        if (!existingProgress) {
            const created = this.progressRepository.create(this.createProgress(personId, materialId) as DeepPartial<TProgress>);
            return await this.progressRepository.save(created);
        }

        return existingProgress;
    }

    async updateMaterialProgress(userId: string, role: ValidRoles, materialId: string, dto: UpdateProgressDto): Promise<TProgress> {

        const person = await this.personRepository.findOne({ where: this.getPersonWhereClause(userId) });
        if (!person) throw new NotFoundException(`User with ID ${userId} not found`);
        const personId = this.getPersonId(person);

        const existingProgress = await this.progressRepository.findOne({
            where: {
                [this.getPersonRelationField()]: { id: personId },
                material: { id: materialId },
            } as any,
            relations: ['material', 'material.lesson', 'material.lesson.course']
        });

        if (!existingProgress) throw new NotFoundException(`Progress not found`);
        const { id: courseId } = existingProgress.material.lesson.course;
        delete existingProgress.material.lesson;

        const { lastPosition, finished, score } = dto;
        const materialDuration = existingProgress.material.duration;

        if (finished === true) {
            existingProgress.lastPosition = materialDuration;
            existingProgress.progressPercentage = 100;
            if (score) { existingProgress.score = score; }
            this.eventEmitter.emit('person.material.completed', new MaterialCompletedEvent(userId, role, courseId, materialDuration));
            return await this.progressRepository.save(existingProgress);
        }

        if (!finished && lastPosition === 0) {
            this.eventEmitter.emit('person.material.completed', new MaterialCompletedEvent(userId, role, courseId, (materialDuration * -1)));
        }

        if (existingProgress.material.type === MaterialType.video) {
            existingProgress.progressPercentage = this.calculateMaterialProgressPercentage(materialDuration, lastPosition);
            existingProgress.lastPosition = lastPosition;
            return await this.progressRepository.save(existingProgress);
        }

        return existingProgress;
    }


    // ------------------------ HELPER METHODS ------------------------
    private calculateMaterialProgressPercentage(duration: number, lastPosition: number): number {
        if (lastPosition < 0 || lastPosition > duration) {
            throw new BadRequestException(`Invalid position ${lastPosition}`);
        }
        return Number(((lastPosition / duration) * 100).toFixed(2));
    }

    private buildCourseProgress(course: Course, progressAlias: string, includeMats: boolean = false): CourseWithProgress {

        let totalLessons = 0;
        let completedLessons = 0;
        let totalMaterials = 0;
        let completedMaterials = 0;
        let globalDuration = 0;
        let completedDuration = 0;

        let totalVideos = 0;
        let completedVideos = 0;
        let totalQuizzes = 0;
        let completedQuizzes = 0;

        const lessons = course.lessons.map(lesson => {

            const { totalMaterials: lessonTotal, completedMaterials: lessonCompleted, mats } = this.calculateMaterialProgress(lesson.materials, progressAlias);
            totalMaterials += lessonTotal;
            completedMaterials += lessonCompleted;
            totalLessons++;
            globalDuration += lesson.totalDuration || 0;
            completedDuration += lessonCompleted * (lesson.totalDuration / lessonTotal || 0);
            totalVideos += mats.filter(m => m.type === MaterialType.video).length;
            completedVideos += mats.filter(m => m.type === MaterialType.video && m.completed).length;
            totalQuizzes += mats.filter(m => m.type === MaterialType.quiz).length;
            completedQuizzes += mats.filter(m => m.type === MaterialType.quiz && m.completed).length;


            const progressPercentage = lessonTotal === 0 ? 0 : Math.round((lessonCompleted / lessonTotal) * 100);
            if (progressPercentage === 100) completedLessons++;

            return {
                id: lesson.id,
                title: lesson.title,
                lessonDuration: lesson.totalDuration,
                firstMaterialId: lesson.materials[0]?.id || null,
                totalMaterials: lessonTotal,
                completedMaterials: lessonCompleted,
                progressPercentage,
                materials: includeMats ? mats : undefined,
            };
        });

        return {
            id: course.id,
            title: course.title,
            description: course.description,
            level: course.level,
            videoUrl: course.videoUrl,
            imageUrl: course.imageUrl,
            creation_date: course.creation_date,
            lessons,
            completedLessons,
            totalLessons,
            progressLessons: totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100),
            completedMaterials,
            totalMaterials,
            progressMaterials: totalMaterials === 0 ? 0 : Math.round((completedMaterials / totalMaterials) * 100),
            globalDuration: Math.round(globalDuration),
            completedDuration: Math.round(completedDuration),
            remainingDuration: Math.round(globalDuration - completedDuration),
            totalVideos,
            completedVideos,
            totalQuizzes,
            completedQuizzes,
        };
    }

    private calculateMaterialProgress(materials: Material[], progressAlias: string): MaterialProgressResponse {
        const totalMaterials = materials.length;
        let completedMaterials = 0;

        let mats = [];

        materials.forEach(material => {
            const progresses = material[progressAlias] || [];
            let completed = false;

            if (progresses.some((p: any) => p.progressPercentage === 100)) {
                completedMaterials++;
                completed = true;
            }

            mats.push({
                id: material.id,
                type: material.type,
                title: material.title,
                url: material.url,
                duration: material.duration,
                completed,
            });
        });

        return { totalMaterials, completedMaterials, mats };
    }
}
