import {
  useGenericListQuery,
  useGenericItemQuery,
  useGenericMutation,
  useGenericPaginatedQuery,
} from '../../../hooks/useQueries';
import { usePaginatedQuery } from '../../../hooks/usePaginatedQuery';
import { AssessmentQuestionsService } from '../services/assessment-questions.service';
import { IQuestionAnswers } from '../interfaces/questions.interfaces';
import { CreateQuestionDto, UpdateQuestionDto } from '../schemas/questions.schemas';
import { IPaginationParams } from '../../../common/interfaces';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export const QUESTIONS_QUERY_KEY = 'questions';
export const AVAILABLE_QUESTIONS_QUERY_KEY = 'available-questions';
export const QUESTION_IMAGE_QUERY_KEY = 'question-image';

export const useQuestions = () => useGenericListQuery<IQuestionAnswers>(QUESTIONS_QUERY_KEY, AssessmentQuestionsService.list);

export const useAvailableQuestions = (assessmentId: string, search?: string) => {
  const queryKey = search
    ? [AVAILABLE_QUESTIONS_QUERY_KEY, assessmentId, search]
    : [AVAILABLE_QUESTIONS_QUERY_KEY, assessmentId];

  return useGenericListQuery<IQuestionAnswers>(
    queryKey,
    () => AssessmentQuestionsService.findAvailableQuestions(assessmentId, search)
  );
};

export const useInvalidateAvailableQuestions = () => {
  const queryClient = useQueryClient();

  return (assessmentId: string) => {
    queryClient.invalidateQueries({
      queryKey: [AVAILABLE_QUESTIONS_QUERY_KEY, assessmentId]
    });
  };
};

export const useQuestionsPaginated = (params: IPaginationParams) => useGenericPaginatedQuery<IQuestionAnswers>(QUESTIONS_QUERY_KEY, AssessmentQuestionsService.listPaginated, params);

// New hook for paginated questions with table integration
export const useQuestionsPaginatedTable = (options?: { initialPage?: number; initialRowsPerPage?: number }) =>
  usePaginatedQuery<IQuestionAnswers>(
    QUESTIONS_QUERY_KEY,
    AssessmentQuestionsService.listPaginated,
    options
  );

// New hook for paginated questions with search functionality
export const useQuestionsPaginatedTableWithSearch = (options?: { 
  initialPage?: number; 
  initialRowsPerPage?: number;
  search?: string;
}) => {
  const { search, ...paginationOptions } = options || {};
  const [debouncedSearch, setDebouncedSearch] = useState(search || '');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search || '');
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const queryKey = debouncedSearch 
    ? `${QUESTIONS_QUERY_KEY}-search-${debouncedSearch}`
    : QUESTIONS_QUERY_KEY;

  return usePaginatedQuery<IQuestionAnswers>(
    queryKey,
    (params) => AssessmentQuestionsService.listPaginated({ ...params, search: debouncedSearch }),
    paginationOptions
  );
};

export const useQuestion = (id: string | undefined) => useGenericItemQuery<IQuestionAnswers>(QUESTIONS_QUERY_KEY, id, AssessmentQuestionsService.get);

export const useCreateQuestion = () => useGenericMutation<CreateQuestionDto>(AssessmentQuestionsService.create, QUESTIONS_QUERY_KEY);

export const useUpdateQuestion = () => useGenericMutation<{ id: string; dto: UpdateQuestionDto }>(({ id, dto }) => AssessmentQuestionsService.update(id, dto), QUESTIONS_QUERY_KEY);

export const useDeleteQuestion = () => useGenericMutation<string>(AssessmentQuestionsService.remove, QUESTIONS_QUERY_KEY);

export const useGetQuestionImage = (id: string) => useGenericItemQuery<string | null>(
  QUESTION_IMAGE_QUERY_KEY,
  id,
  AssessmentQuestionsService.getQuestionImage,
  {
    retry: false,
    staleTime: 0, // Always consider data stale so it refetches
  }
);

export const useUploadQuestionImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => AssessmentQuestionsService.uploadQuestionImage(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUESTION_IMAGE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUESTIONS_QUERY_KEY] });
    }
  });
};

export const useRemoveQuestionImage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => AssessmentQuestionsService.removeQuestionImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUESTION_IMAGE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [QUESTIONS_QUERY_KEY] });
    }
  });
};
