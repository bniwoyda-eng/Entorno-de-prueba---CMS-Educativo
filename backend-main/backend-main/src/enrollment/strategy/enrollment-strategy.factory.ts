// strategy/enrollment-strategy.factory.ts
import { Injectable } from '@nestjs/common';
import { EnrollmentStrategy } from './enrollment-strategy.interface';
import { StudentEnrollmentStrategy } from './student-enrollment.strategy';
import { EducatorEnrollmentStrategy } from './educator-enrollment.strategy';
import { ValidRoles } from 'src/auth';

@Injectable()
export class EnrollmentStrategyFactory {
    constructor(
        private readonly studentStrategy: StudentEnrollmentStrategy,
        private readonly educatorStrategy: EducatorEnrollmentStrategy
    ) { }

    getStrategy(role: ValidRoles): EnrollmentStrategy {
        switch (role) {
            case ValidRoles.student:
                return this.studentStrategy;
            case ValidRoles.educator:
                return this.educatorStrategy;
            default:
                throw new Error(`No strategy implemented for role ${role}`);
        }
    }
}
