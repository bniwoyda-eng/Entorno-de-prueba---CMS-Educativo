import {
  useGenericListQuery,
  useGenericItemQuery,
  useGenericMutation,
  useGenericPaginatedQuery,
} from '../../../hooks/useQueries';
import { AssessmentService, AssessmentFilters } from '../services/assessments.service';
import { AssessmentCategoryService } from '../services/assessment-category.service';
import { IAssessment, IAssessmentWithQuestions, IAssessmentCategory } from '../interfaces/assessments.interfaces';
import { CreateAssessmentDto, UpdateAssessmentDto } from '../schemas/assessments.schemas';
import { IPaginationParams } from '../../../common/interfaces';

export const ASSESSMENTS_QUERY_KEY = 'assessments';
export const ASSESSMENTS_WITH_QUESTIONS_QUERY_KEY = 'assessments-with-questions';
export const ASSESSMENT_CATEGORIES_QUERY_KEY = 'assessment-categories';

export const useAssessments = (filters?: AssessmentFilters) => {
  const queryKey = filters ? [ASSESSMENTS_QUERY_KEY, JSON.stringify(filters)] : [ASSESSMENTS_QUERY_KEY];
  return useGenericListQuery<IAssessment>(queryKey, () => AssessmentService.list(filters));
};

export const useAssessmentsPaginated = (params: IPaginationParams) => useGenericPaginatedQuery<IAssessment>(ASSESSMENTS_QUERY_KEY, AssessmentService.listPaginated, params);

export const useAssessment = (id: string | undefined) => useGenericItemQuery<IAssessment>(ASSESSMENTS_QUERY_KEY, id, AssessmentService.get);

export const useAssessmentWithQuestions = (id: string | undefined) => useGenericItemQuery<IAssessmentWithQuestions>(ASSESSMENTS_WITH_QUESTIONS_QUERY_KEY, id, AssessmentService.getWithQuestions);

export const useTopAssessmentsByAttempts = (order: 'ASC' | 'DESC' = 'DESC', limit: number = 10) => {
  const queryKey = ['assessments-top-by-attempts', order, limit.toString()];
  return useGenericListQuery<IAssessment>(queryKey, () => AssessmentService.getTopByAttempts(order, limit));
};

export const useAssessmentCategories = () => useGenericListQuery<IAssessmentCategory>(ASSESSMENT_CATEGORIES_QUERY_KEY, AssessmentCategoryService.list);

export const useCreateAssessment = () => useGenericMutation<CreateAssessmentDto>(AssessmentService.create, ASSESSMENTS_QUERY_KEY);

export const useUpdateAssessment = () => useGenericMutation<{ id: string; dto: UpdateAssessmentDto }>(({ id, dto }) => AssessmentService.update(id, dto), ASSESSMENTS_QUERY_KEY);

export const useDeleteAssessment = () => useGenericMutation<string>(AssessmentService.remove, ASSESSMENTS_QUERY_KEY);