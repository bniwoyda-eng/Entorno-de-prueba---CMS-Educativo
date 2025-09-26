import { IBasicEducator } from ".";

export interface IAuthorProfile {
    educator: IBasicEducator;
    posts: IPost[];
}

export interface ITag {
    id: string;
    name: string;
}

export interface IPostImage {
    id: string;
    originalName: string;
    imageKey: string;
    slug: string;
    size: number;
    mimetype: string;
}

export interface IPostComment {
    id: string;
    comment: string;
    creation_date: string;
    educator: IBasicEducator;
}

export interface IPost {
    id: string;
    title: string;
    content: string;
    views: number;
    replies: number;
    creation_date: string;
    educator: IBasicEducator;
    tags: ITag[];
    images: IPostImage[];
}

export interface PostsQueryParams {
    page?: number;
    limit?: number;
    tag?: string;
}