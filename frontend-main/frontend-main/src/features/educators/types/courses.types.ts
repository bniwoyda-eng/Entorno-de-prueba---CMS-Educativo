export interface ICourseStatistics {
    course: {
        id: string;
        title: string;
        description: string;
        totalDuration: number;
        lessonCount: number;
        totalMaterials: number;
        totalVideos: number;
        totalQuizzes: number;
    }
    statistics: {
        totalStudentsEnrolled: number;
        studentsWithProgress: number;
        studentsCompleted: number;
        avgCompletionPercentage: number;
        courseCompletionRate: number;
        avgMaterialsPerStudent: number;
    }
    progressDistribution: { [key: string]: number };
    quizPerformance: {
        avgQuizScore: number;
        bestQuizMaterial: {
            id: string;
            title: string;
            sequence: number;
        }
        worstQuizMaterial: {
            id: string;
            title: string;
            sequence: number;
        }
        totalQuizCompletions: number;
        totalQuizzes: number;
    }
    materialProgress: {
        videoCompletions: number;
        totalVideos: number;
        quizCompletions: number;
        totalQuizzes: number;
        videoCompletionRate: number;
        quizCompletionRate: number;
    }
    mostCompletedMaterial: {
        id: string;
        title: string;
        type: string;
        sequence: number;
        completions: number;
    }
}

export interface ICourseStatisticsForStudent {
    course: {
        id: string;
        title: string;
        description: string;
        totalDuration: number;
        lessonCount: number;
        totalMaterials: number;
        totalVideos: number;
        totalQuizzes: number;
    }
    student: {
        id: string;
        name: string;
        email: string;
        enrollmentDate: Date;
    }
    progress: {
        overallProgress: number;
        completedMaterials: number;
        totalMaterials: number;
        materialsWithProgress: number;
        completedLessons: number;
        totalLessons: number;
        completionRate: number;
    }
    materialProgress: {
        videos: {
            completed: number;
            total: number;
            completionRate: number;
        };
        quizzes: {
            completed: number;
            total: number;
            completionRate: number;
        }
    }
    quizPerformance: {
        avgScore: number;
        bestScore: number;
        worstScore: number;
        totalAttempted: number;
        totalQuizzes: number;
    }
    timeEstimation: {
        estimatedTimeRemaining: number;
        avgMaterialDuration: number;
        remainingMaterials: number;
    }
    lessonsProgress: {
        id: string;
        title: string;
        sequence: number;
        totalMaterials: number;
        completedMaterials: number;
        progressPercentage: number;
        isCompleted: boolean;
    }[]
    recentActivity: {
        recentCompletedMaterials: {
            id: string;
            title: string;
            type: string;
            lessonTitle: string;
            completedAt: Date;
        }[];
        nextRecommendedMaterial: {
            id: string;
            title: string;
            type: string;
            lessonTitle: string;
            lessonSequence: number;
            duration: number;
        } | null;
    }
}

export interface IStudent {
    id: string;
    creation_date: Date;
    update_date: Date;
    delete_date: Date | null;
    profilePicture: string;
    fullName: string;
    email: string;
    whatsappPhone: string;
    progressPercentage?: number; // Optional because it may not always be included
}