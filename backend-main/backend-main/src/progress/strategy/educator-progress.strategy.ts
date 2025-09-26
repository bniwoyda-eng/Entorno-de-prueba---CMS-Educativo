// strategy/educator-progress.strategy.ts
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseProgressStrategy } from './base-progress.strategy';
import { Course, Educator, EducatorEnrollment } from 'src/exports/entities';
import { ProgressStrategy } from './progress-strategy.interface';
import { EducatorProgress } from '../entities';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class EducatorProgressStrategy extends BaseProgressStrategy<Educator, EducatorProgress, EducatorEnrollment> implements ProgressStrategy {
    constructor(
        eventEmitter: EventEmitter2,
        @InjectRepository(Educator)
        educatorRepo: Repository<Educator>,
        @InjectRepository(EducatorProgress)
        progressRepo: Repository<EducatorProgress>,
        @InjectRepository(EducatorEnrollment)
        educatorEnrollmentRepo: Repository<EducatorEnrollment>,
        @InjectRepository(Course)
        courseRepo: Repository<Course>,
    ) {
        super(eventEmitter, educatorRepo, progressRepo, educatorEnrollmentRepo, courseRepo);
    }

    protected getPersonWhereClause(userId: string) {
        return { user: { id: userId } };
    }

    protected getPersonId(person: Educator) {
        return person.id;
    }

    protected getPersonRelationField(): 'educator' {
        return 'educator';
    }

    protected getPersonRelationAlias(): 'educatorProgress' {
        return 'educatorProgress';
    }

    protected createProgress(educatorId: string, materialId: string): Partial<EducatorProgress> {
        return {
            educator: { id: educatorId } as any,
            material: { id: materialId } as any,
            progressPercentage: 0,
            lastPosition: 0,
        };
    }
}
