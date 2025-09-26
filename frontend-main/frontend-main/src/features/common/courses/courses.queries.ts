import { useQuery, useMutation } from '@tanstack/react-query';
import { getEnrollments, getGlobalProgress, getCourseProgress, getMaterialProgress, updateStudentMaterialProgress, checkQuiz, getQuiz } from './courses.api';
import { IQuestionAnswer } from './courses.types';

const MIN1 = 1000 * 60;
const MIN3 = 1000 * 60 * 3;
const MIN5 = 1000 * 60 * 5;

export const useEnrollments = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['enrollments'],
        queryFn: getEnrollments,
        staleTime: MIN5,
        retry: false,
    });
    return { data, isLoading, isError };
}

export const useGlobalProgress = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['global-progress'],
        queryFn: getGlobalProgress,
        staleTime: MIN3,
        retry: false,
    });
    return { data, isLoading, isError };
}

export const useCourseProgress = (courseId: string) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['course', courseId],
        queryFn: () => getCourseProgress(courseId),
        enabled: !!courseId,
        staleTime: MIN3,
        retry: false,
    });
    return { data, isLoading, isError };
}

export const useMaterialProgress = (materialId: string) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['material', materialId],
        queryFn: () => getMaterialProgress(materialId),
        staleTime: MIN1,
        retry: false,
        enabled: !!materialId
    });
    return { data, isLoading, isError };
}

export const useUpdateMaterialProgress = (materialId: string) => {
    return useMutation({
        mutationFn: (data: { lastPosition: number; finished: boolean }) =>
            updateStudentMaterialProgress(materialId, data.lastPosition, data.finished),
        mutationKey: ['update-material', materialId],
    });
}

export const useGetQuiz = (materialId: string) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['quiz', materialId],
        queryFn: () => getQuiz(materialId),
        enabled: !!materialId,
        staleTime: MIN3,
        retry: false,
    });
    return { data, isLoading, isError };
}

export const useCheckQuiz = (materialId: string) => {
    return useMutation({
        mutationFn: ({ quizId, answers }: {
            quizId: string; answers: IQuestionAnswer[];
        }) => checkQuiz(quizId, materialId, answers)
    });
};
