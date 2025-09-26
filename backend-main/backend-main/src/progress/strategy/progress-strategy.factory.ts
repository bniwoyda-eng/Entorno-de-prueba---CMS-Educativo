// strategy/progress-strategy.factory.ts
import { Injectable } from '@nestjs/common';
import { ProgressStrategy } from './progress-strategy.interface';
import { StudentProgressStrategy } from './student-progress.strategy';
import { EducatorProgressStrategy } from './educator-progress.strategy';
import { ValidRoles } from 'src/auth';

@Injectable()
export class ProgressStrategyFactory {
    constructor(
        private readonly studentStrategy: StudentProgressStrategy,
        private readonly educatorStrategy: EducatorProgressStrategy
    ) { }

    getStrategy(role: ValidRoles): ProgressStrategy {
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
