// strategy/base-enrollment.strategy.ts
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException, } from '@nestjs/common';
import { MaterialCompletedEvent } from 'src/progress/events';
import { BaseEnrollmentProgress } from '../entities';
import { Material } from 'src/materials/entities';
import { OnEvent } from '@nestjs/event-emitter';


export abstract class BaseEnrollmentStrategy<TPerson, TEnrollment extends BaseEnrollmentProgress> {
    constructor(
        protected readonly personRepository: Repository<TPerson>,
        protected readonly enrollmentRepository: Repository<TEnrollment>,
        protected readonly materialRepository: Repository<Material>,
    ) { }

    protected abstract getPersonWhereClause(userId: string): any;
    protected abstract getPersonId(person: TPerson): string;
    protected abstract getPersonRelationField(): string;

    async getMyEnrollments(userId: string): Promise<any> {
        const person = await this.personRepository.findOne({ where: this.getPersonWhereClause(userId) });
        if (!person) throw new NotFoundException(`User with ID ${userId} not found`);
        const personId = this.getPersonId(person);

        const enrollments = await this.enrollmentRepository
            .createQueryBuilder('enrollments')
            .where(`enrollments.${this.getPersonRelationField()}_id = :personId`, { personId })
            .leftJoinAndSelect('enrollments.course', 'course')
            .select([
                'enrollments.id',           // Solo el ID del enrollment (actualmente se usa para redirigir a la vista de curso pero lo voy a cambiar)
                'course.id',                // Solo el ID de course
                'course.title',             // Solo el title del curso  
                'course.lessonCount',       // Solo la cantidad de lecciones
            ])
            .orderBy('course.sequence', 'ASC')
            .getMany();

        return enrollments;
    }

    // CORREGIR ACTUALIZACIONES DE PROGRESO
    // VER SI CONVIENE GUARDAR SEGUNDOS O CANTIDAD DE MATERIALES
    async updateEnrollmentProgress(event: MaterialCompletedEvent): Promise<void> {
        const { userId, courseId, materialDuration } = event;

        const person = await this.personRepository.findOne({ where: this.getPersonWhereClause(userId) });
        if (!person) throw new NotFoundException(`Person with User ID ${userId} not found`);
        const personId = this.getPersonId(person);

        const enrollment = await this.enrollmentRepository.createQueryBuilder('enrollment')
            .where(`enrollment.${this.getPersonRelationField()}_id = :personId`, { personId })
            .andWhere('enrollment.course_id = :courseId', { courseId })
            .leftJoinAndSelect('enrollment.course', 'course')
            .getOne();
        if (!enrollment) throw new NotFoundException(`Enrollment with course ID ${courseId} not found for user ID ${userId}`);

        // Actualizar el progreso del enrollment (sumar el tiempo de duración del material)
        const totalCompleted = (enrollment.totalCompleted || 0) + materialDuration;
        const progressPercentage = Math.min(Math.round((totalCompleted / enrollment.course.totalDuration) * 100), 100);

        enrollment.totalCompleted = totalCompleted;
        enrollment.progressPercentage = progressPercentage;
        enrollment.completedAt = progressPercentage === 100 ? new Date() : null;
        await this.enrollmentRepository.save(enrollment);
    }
}