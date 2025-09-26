// strategy/student-progress.strategy.ts
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseProgressStrategy } from './base-progress.strategy';
import { Course, Student, StudentEnrollment } from 'src/exports/entities';
import { ProgressStrategy } from './progress-strategy.interface';
import { StudentProgress } from '../entities';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class StudentProgressStrategy extends BaseProgressStrategy<Student, StudentProgress, StudentEnrollment> implements ProgressStrategy {
    constructor(
        eventEmitter: EventEmitter2,
        @InjectRepository(Student)
        studentRepo: Repository<Student>,
        @InjectRepository(StudentProgress)
        progressRepo: Repository<StudentProgress>,
        @InjectRepository(StudentEnrollment)
        studentEnrollmentRepo: Repository<StudentEnrollment>,
        @InjectRepository(Course)
        courseRepo: Repository<Course>,
    ) {
        super(eventEmitter, studentRepo, progressRepo, studentEnrollmentRepo, courseRepo);
    }

    protected getPersonWhereClause(userId: string) {
        return { user: { id: userId } };
    }

    protected getPersonId(person: Student) {
        return person.id;
    }

    protected getPersonRelationField(): 'student' {
        return 'student';
    }

    protected getPersonRelationAlias(): 'studentProgress' {
        return 'studentProgress';
    }

    protected createProgress(studentId: string, materialId: string): Partial<StudentProgress> {
        return {
            student: { id: studentId } as any,
            material: { id: materialId } as any,
            progressPercentage: 0,
            lastPosition: 0,
        };
    }
}
