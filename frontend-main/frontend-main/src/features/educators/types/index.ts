export * from './resources.types';
export * from './resources.dictionary';

export interface IBasicEducator {
    id: string;
    fullName: string;
    profilePicture: string;
}

export interface ISuggestedEducator {
    id: string;
    fullName: string;
    profilePicture: string;
    email: string;
    whatsappPhone: string;
    totalPosts: number;
}

export interface ISuggestedPost {
    id: string;
    title: string;
    replies: number;
    views: number;
}