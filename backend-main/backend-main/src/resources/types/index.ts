export enum ResourceType {
    ARTICLE = 'article',
    VIDEO = 'video',
    ACTIVITY = 'activity',
    OTHER = 'other',
}

export enum ResourceStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published',
    ARCHIVED = 'archived',
}

export type GroupedResource = {
    resourceType: string;
    resources: {
        id: string;
        title: string;
        resourceType: string;
        creationDate: string;
    }[];
};
