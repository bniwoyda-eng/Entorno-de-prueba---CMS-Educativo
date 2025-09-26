import {
  useGenericListQuery,
  useGenericItemQuery,
  useGenericMutation,
} from '../../../hooks/useQueries';
import { AssessmentRiskSegmentService } from '../services/assessment-risk-segment.service';
import { IAssessmentRiskSegment } from '../interfaces/assessments.interfaces';
import { CreateAssessmentRiskSegmentDto, UpdateAssessmentRiskSegmentDto } from '../schemas/assessment-risk-segments.schemas';

export const ASSESSMENT_RISK_SEGMENT_QUERY_KEY = 'assessment-risk-segments';

export const useAssessmentRiskSegments = () => useGenericListQuery<IAssessmentRiskSegment>(ASSESSMENT_RISK_SEGMENT_QUERY_KEY, AssessmentRiskSegmentService.list);

export const useAssessmentRiskSegment = (id: string) => useGenericItemQuery<IAssessmentRiskSegment>(ASSESSMENT_RISK_SEGMENT_QUERY_KEY, id, AssessmentRiskSegmentService.get);

export const useAssessmentRiskSegmentsByAssessmentId = (assessmentId: string) =>
  useGenericListQuery<IAssessmentRiskSegment>(
    ASSESSMENT_RISK_SEGMENT_QUERY_KEY, () => AssessmentRiskSegmentService.getByAssessmentId(assessmentId), {
    enabled: !!assessmentId,
  });

export const useCreateAssessmentRiskSegment = () => useGenericMutation<CreateAssessmentRiskSegmentDto>(AssessmentRiskSegmentService.create, ASSESSMENT_RISK_SEGMENT_QUERY_KEY);

export const useUpdateAssessmentRiskSegment = () => useGenericMutation<{ id: string; dto: UpdateAssessmentRiskSegmentDto }>(({ id, dto }) => AssessmentRiskSegmentService.update(id, dto), ASSESSMENT_RISK_SEGMENT_QUERY_KEY);

export const useDeleteAssessmentRiskSegment = () => useGenericMutation<string>(AssessmentRiskSegmentService.remove, ASSESSMENT_RISK_SEGMENT_QUERY_KEY);

type UpsertManyRiskSegmentsPayload = {
  assessmentId: string;
  dto: CreateAssessmentRiskSegmentDto[];
};

export const useCreateManyAssessmentRiskSegments = () =>
  useGenericMutation<UpsertManyRiskSegmentsPayload>(
    ({ assessmentId, dto }) =>
      AssessmentRiskSegmentService.createMany(assessmentId, dto),
    ASSESSMENT_RISK_SEGMENT_QUERY_KEY
  );