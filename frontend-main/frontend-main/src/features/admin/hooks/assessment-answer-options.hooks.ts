import {
    useGenericListQuery,
    useGenericItemQuery,
    useGenericMutation,
    useGenericPaginatedQuery,
} from '../../../hooks/useQueries';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AssessmentAnswerOptionsService } from '../services/assessment-answer-options.service';
import { IQuestionAnswerOption } from '../interfaces/questions.interfaces';
import { CreateQuestionOptionDto, UpdateQuestionOptionDto } from '../schemas/questions.schemas';
import { IPaginationParams } from '../../../common/interfaces';

export const ASSESSMENT_ANSWER_OPTIONS_QUERY_KEY = 'assessment-answer-options';

export const useAssessmentAnswerOptions = () => useGenericListQuery<IQuestionAnswerOption>(ASSESSMENT_ANSWER_OPTIONS_QUERY_KEY, AssessmentAnswerOptionsService.list);

export const useAssessmentAnswerOptionsPaginated = (params: IPaginationParams) => useGenericPaginatedQuery<IQuestionAnswerOption>(ASSESSMENT_ANSWER_OPTIONS_QUERY_KEY, AssessmentAnswerOptionsService.listPaginated, params);

export const useAssessmentAnswerOptionByQuestionId = (id: string) => useGenericListQuery<IQuestionAnswerOption>([ASSESSMENT_ANSWER_OPTIONS_QUERY_KEY, id], () => AssessmentAnswerOptionsService.getByQuestionId(id), {
    enabled: !!id,
});

export const useAssessmentAnswerOption = (id: string | undefined) => useGenericItemQuery<IQuestionAnswerOption>(ASSESSMENT_ANSWER_OPTIONS_QUERY_KEY, id, AssessmentAnswerOptionsService.get);

export const useCreateAssessmentAnswerOption = () => useGenericMutation<{ id_question: string; option: CreateQuestionOptionDto }>(({ id_question, option }) => AssessmentAnswerOptionsService.create(id_question, option), ASSESSMENT_ANSWER_OPTIONS_QUERY_KEY);

export const useUpdateAssessmentAnswerOption = () => useGenericMutation<{ id: string; option: UpdateQuestionOptionDto }>(({ id, option }) => AssessmentAnswerOptionsService.update(id, option), ASSESSMENT_ANSWER_OPTIONS_QUERY_KEY);

export const useDeleteAssessmentAnswerOption = () => useGenericMutation<string>(AssessmentAnswerOptionsService.remove, ASSESSMENT_ANSWER_OPTIONS_QUERY_KEY);

export const useCreateAssessmentAnswerOptionForQuestion = (questionId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id_question, option }: { id_question: string; option: CreateQuestionOptionDto }) => 
            AssessmentAnswerOptionsService.create(id_question, option),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [[ASSESSMENT_ANSWER_OPTIONS_QUERY_KEY, questionId]],
            });
            queryClient.invalidateQueries({
                queryKey: [ASSESSMENT_ANSWER_OPTIONS_QUERY_KEY],
            });
        },
    });
};

export const useUpdateAssessmentAnswerOptionForQuestion = (questionId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, option }: { id: string; option: UpdateQuestionOptionDto }) => 
            AssessmentAnswerOptionsService.update(id, option),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [[ASSESSMENT_ANSWER_OPTIONS_QUERY_KEY, questionId]],
            });
            queryClient.invalidateQueries({
                queryKey: [ASSESSMENT_ANSWER_OPTIONS_QUERY_KEY],
            });
        },
    });
};

export const useDeleteAssessmentAnswerOptionForQuestion = (questionId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => AssessmentAnswerOptionsService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [[ASSESSMENT_ANSWER_OPTIONS_QUERY_KEY, questionId]],
            });
            queryClient.invalidateQueries({
                queryKey: [ASSESSMENT_ANSWER_OPTIONS_QUERY_KEY],
            });
        },
    });
};