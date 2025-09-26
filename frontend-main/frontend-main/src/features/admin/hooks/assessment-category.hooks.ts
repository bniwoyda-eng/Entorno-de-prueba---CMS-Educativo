import {
  useGenericListQuery,
  useGenericItemQuery,
  useGenericMutation,
} from '../../../hooks/useQueries';
import { AssessmentCategoryService } from '../services/assessment-category.service';
import { IAssessmentCategory } from '../interfaces/assessments.interfaces';
import { CreateAssessmentCategoryDto, UpdateAssessmentCategoryDto } from '../schemas/assessment-categories.schemas';

export const ASSESSMENT_CATEGORY_QUERY_KEY = 'assessment-categories';

export const useAssessmentCategories = () => useGenericListQuery<IAssessmentCategory>(ASSESSMENT_CATEGORY_QUERY_KEY, AssessmentCategoryService.list);

export const useAssessmentCategory = (id: string) => useGenericItemQuery<IAssessmentCategory>(ASSESSMENT_CATEGORY_QUERY_KEY, id, AssessmentCategoryService.get);

export const useCreateAssessmentCategory = () => useGenericMutation<CreateAssessmentCategoryDto>(AssessmentCategoryService.create, ASSESSMENT_CATEGORY_QUERY_KEY);

export const useUpdateAssessmentCategory = () => useGenericMutation<{ id: string; dto: UpdateAssessmentCategoryDto }>(({ id, dto }) => AssessmentCategoryService.update(id, dto), ASSESSMENT_CATEGORY_QUERY_KEY);

export const useDeleteAssessmentCategory = () => useGenericMutation<string>(AssessmentCategoryService.remove, ASSESSMENT_CATEGORY_QUERY_KEY);