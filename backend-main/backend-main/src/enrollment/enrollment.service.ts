import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MaterialCompletedEvent } from 'src/progress/events';
import { EnrollmentStrategyFactory } from './strategy';
import { User } from 'src/auth/entities';

@Injectable()
export class EnrollmentsService {
    constructor(
        private readonly factory: EnrollmentStrategyFactory,
    ) { }

    getMyEnrollments(user: User) {
        const { id: userId, roles } = user;
        const strategy = this.factory.getStrategy(roles[0]);
        return strategy.getMyEnrollments(userId);
    }

    @OnEvent('person.material.completed')
    async handleMaterialCompletedEvent(event: MaterialCompletedEvent) {
        const strategy = this.factory.getStrategy(event.role);
        await strategy.updateEnrollmentProgress(event);
    }

}
