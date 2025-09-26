// strategy/student-enrollment.strategy.ts
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseEnrollmentStrategy } from './base-enrollment.strategy';
import { EnrollmentStrategy } from './enrollment-strategy.interface';
import { StudentEnrollment } from '../entities';
import { Material, Student } from 'src/exports/entities';

@Injectable()
export class StudentEnrollmentStrategy extends BaseEnrollmentStrategy<Student, StudentEnrollment> implements EnrollmentStrategy {
    constructor(
        @InjectRepository(Student)
        studentRepo: Repository<Student>,
        @InjectRepository(StudentEnrollment)
        progressRepo: Repository<StudentEnrollment>,
        @InjectRepository(Material)
        materialRepo: Repository<Material>
    ) {
        super(studentRepo, progressRepo, materialRepo);
    }

    protected getPersonWhereClause(userId: string) {
        return { user: { id: userId } };
    }

    protected getPersonId(person: Student) {
        return person.id;
    }

    protected getPersonRelationField() {
        return 'student';
    }
}
