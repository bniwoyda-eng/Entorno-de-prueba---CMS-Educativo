import { ValidRoles } from "src/auth";

export class MaterialCompletedEvent {
    constructor(
        public readonly userId: string,
        public readonly role: ValidRoles,
        public readonly courseId: string,
        public readonly materialDuration: number,
    ) {}
}
