import { MaterialCompletedEvent } from "src/progress/events";

// strategy/enrollment-strategy.interface.ts
export interface EnrollmentStrategy {
    getMyEnrollments(userId: string): Promise<any>;
    updateEnrollmentProgress(event: MaterialCompletedEvent): Promise<void>;
}
