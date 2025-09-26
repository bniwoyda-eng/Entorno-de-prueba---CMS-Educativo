import { IBasicEducator } from ".";

export const Resources = {
    ACTIVITY: "activity",
    ARTICLE: "article",
    VIDEO: "video",
    OTHER: "other",
} as const;

export type Resource = (typeof Resources)[keyof typeof Resources];

export interface IResource {
    id: string;
    resourceType: Resource;
    thumbnailUrl: string;
    title: string;
    extract: string;
    creation_date: string;
    minsDuration: number;
    views: number;
}

export interface GroupedResource {
    resourceType: Resource;
    total: number;
    resources: IResource[];
}

export interface ResourceParams {
    page?: number;
    limit?: number;
    search?: string;
    resourceType?: string; // e.g., "video"
}

export interface IResourceDetail extends IResource {
    paragraphs: string[];
    contentUrl: string;
    attachments: {
        id: string;
        name: string;
        mimetype: string;
        url: string;
        downloads: number;
    }[];
}

export interface IResourceComment {
    id: string;
    comment: string;
    creation_date: string;
    educator: IBasicEducator;
}