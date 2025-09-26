import {
  useGenericListQuery,
  useGenericMutation,
} from '../../../hooks/useQueries';
import { IAssessmentQuestionPivot } from '../interfaces/questions.interfaces';
import { AttachQuestionToAssessmentDto } from '../schemas/questions.schemas';
import { AssessmentQuestionPivotsService } from '../services/assessment-question-pivots.service';

export const QUESTIONS_QUERY_KEY = 'question-pivots';

export const useQuestionPivots = (assessmentId: string) => useGenericListQuery<IAssessmentQuestionPivot>(QUESTIONS_QUERY_KEY, () => AssessmentQuestionPivotsService.list(assessmentId));

export const useCreateQuestionPivot = () => useGenericMutation<AttachQuestionToAssessmentDto>(AssessmentQuestionPivotsService.attach, QUESTIONS_QUERY_KEY);

export const useDeleteQuestionPivot = () => useGenericMutation<string>(AssessmentQuestionPivotsService.detach, QUESTIONS_QUERY_KEY);

export const useReorderQuestionPivots = (assessmentId: string) => useGenericMutation<AttachQuestionToAssessmentDto[]>((questions) => AssessmentQuestionPivotsService.reorder(assessmentId, questions), QUESTIONS_QUERY_KEY);

