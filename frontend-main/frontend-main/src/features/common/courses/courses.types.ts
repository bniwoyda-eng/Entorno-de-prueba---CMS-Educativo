export type TCourseLevel = 'BASIC' | 'INTERMEDIATE' | 'ADVANCED';
export interface IEnrollment {
    id: string;
    course: {
        id: string;
        title: string;
        lessonCount: number;
    }
}

export interface ICourseProgress {
    id: string;
    title: string;
    description: string;
    level: TCourseLevel;
    creation_date: string;
    videoUrl: string;
    imageUrl: string;
    lessons: ICourseLesson[];
    totalLessons: number;                   // Total de clases del curso
    completedLessons: number;               // Total de clases completadas
    progressLessons: number;                // % de clases completadas
    totalMaterials: number;                 // Total de materiales del curso
    completedMaterials: number;             // Total de materiales completados
    progressMaterials: number;              // % de materiales completados
    globalDuration: number;                 // Duración total del curso
    completedDuration: number;              // Duración total de los materiales completados
    remainingDuration: number;              // Duración total de los materiales restantes
    totalVideos: number;
    completedVideos: number;
    totalQuizzes: number;
    completedQuizzes: number;
}

export interface ICourseLesson {
    id: string;
    title: string;
    lessonDuration: number;             // Duración total de la clase
    firstMaterialId: string | null;
    totalMaterials: number;             // Total de materiales (en la clase)
    completedMaterials: number;         // Total de materiales completados (en la clase)
    progressPercentage: number;         // % de materiales completados (en la clase)
    materials?: ICourseMaterial[];
}

export interface ICourseMaterial {
    id: string;
    type: 'video' | 'quiz';
    title: string;
    url: string;
    duration: number;
    completed: boolean;
}

export type TQuizMaterial = {
    id: string;
    title: string;
    description: string;
    questions: {
        id: string;
        text: string;
        type: 'single' | 'multiple';
        sequence: number;
        answerOptions: {
            id: string;
            option: string;
        }[];
    }[];
}

export interface IMaterialProgress {
    id: string;
    creation_date: string;
    update_date: string;
    studentId: string;
    materialId: string;
    progressPercentage: number;
    lastPosition: number;
    score: number;
}

export interface IQuestionAnswer {
    questionId: string;
    selectedOptionsIds: string[];
}