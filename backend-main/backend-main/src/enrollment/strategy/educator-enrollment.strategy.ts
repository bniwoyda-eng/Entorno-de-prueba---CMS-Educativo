// strategy/educator-progress.strategy.ts
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEnrollmentStrategy } from './base-enrollment.strategy';
import { EnrollmentStrategy } from './enrollment-strategy.interface';
import { EducatorEnrollment } from '../entities';
import { Educator, Material } from 'src/exports/entities';

@Injectable()
export class EducatorEnrollmentStrategy extends BaseEnrollmentStrategy<Educator, EducatorEnrollment> implements EnrollmentStrategy {
    constructor(
        @InjectRepository(Educator)
        educatorRepo: Repository<Educator>,
        @InjectRepository(EducatorEnrollment)
        progressRepo: Repository<EducatorEnrollment>,
        @InjectRepository(Material)
        materialRepo: Repository<Material>
    ) {
        super(educatorRepo, progressRepo, materialRepo);
    }

    protected getPersonWhereClause(userId: string) {
        return { user: { id: userId } };
    }

    protected getPersonId(person: Educator) {
        return person.id;
    }

    protected getPersonRelationField() {
        return 'educator';
    }
 
}
