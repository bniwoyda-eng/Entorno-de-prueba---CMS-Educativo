export class MaterialCreatedEvent {
    constructor(public readonly materialId: string) {}
}

export class MaterialUpdatedEvent {
    constructor(public readonly materialId: string) {}
}

export class MaterialDeletedEvent {
    constructor(public readonly materialId: string) {}
}
