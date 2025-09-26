import { ValidRoles } from "src/auth";
import { UpdateProgressDto } from "../dto";

// strategy/progress-strategy.interface.ts
export interface ProgressStrategy {
    getGlobalProgress(userId: string): Promise<any>;
    getCourseProgress(userId: string, materialId: string): Promise<any>;
    getMaterialProgress(userId: string, materialId: string): Promise<any>;
    updateMaterialProgress(userId: string, role: ValidRoles, materialId: string, dto: UpdateProgressDto): Promise<any>;
}

export interface MaterialProgress {
    id: string;
    type: string;
    title: string;
    url: string;
    duration: number;
    completed: boolean;
}

export interface MaterialProgressResponse {
    totalMaterials: number;
    completedMaterials: number;
    mats: MaterialProgress[];
}

export interface CourseWithProgress {
    id: string;
    title: string;
    description: string;
    level: string;
    videoUrl: string;
    imageUrl: string;
    creation_date: string | Date;
    lessons: {
        id: string;
        title: string;
        lessonDuration: number;
        firstMaterialId: string | null;
        totalMaterials: number;
        completedMaterials: number;
        progressPercentage: number;
        materials?: MaterialProgress[];
    }[];
    totalLessons: number;
    completedLessons: number;
    progressLessons: number;
    totalMaterials: number;
    completedMaterials: number;
    progressMaterials: number;
    globalDuration: number;
    completedDuration: number;
    remainingDuration: number;
    totalVideos: number;
    completedVideos: number;
    totalQuizzes: number;
    completedQuizzes: number;
}