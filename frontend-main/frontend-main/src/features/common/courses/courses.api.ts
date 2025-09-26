import csmApi from "../../../api/csm.api";
import { IEnrollment, ICourseProgress, IMaterialProgress, IQuestionAnswer, TQuizMaterial } from "./courses.types";

export const getEnrollments = async () => {
    const { data } = await csmApi.get<IEnrollment[]>("/enrollments/me");
    return data;
}

export const getGlobalProgress = async () => {
    const { data } = await csmApi.get<ICourseProgress[]>("/progress/global");
    return data;
}

export const getCourseProgress = async (courseId: string) => {
    const { data } = await csmApi.get<ICourseProgress>(`/progress/course/${courseId}`);
    return data;
}

export const getMaterialProgress = async (materialId: string) => {
    const { data } = await csmApi.get<IMaterialProgress>(`/progress/material/${materialId}`);
    return data;
}

export const updateStudentMaterialProgress = async (materialId: string, lastPosition: number, finished: boolean) => {
    const { data } = await csmApi.put<IMaterialProgress>(`/progress/material/${materialId}`, {
        lastPosition,
        finished,
    });
    return data;
}

export const getQuiz = async (materialId: string) => {
    const { data } = await csmApi.get<TQuizMaterial>(`/quizzes/material/${materialId}`);
    return data;
}

export const checkQuiz = async (quizId: string, materialId: string, answers: IQuestionAnswer[]) => {
    const { data } = await csmApi.post<IMaterialProgress>(`/quizzes/${quizId}/check`, { materialId, answers });
    return data;
}