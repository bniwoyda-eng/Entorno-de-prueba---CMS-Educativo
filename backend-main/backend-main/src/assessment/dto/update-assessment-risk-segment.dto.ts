import { PartialType } from '@nestjs/swagger';
import { CreateAssessmentRiskSegmentDto } from './create-assessment-risk-segment.dto';

export class UpdateAssessmentRiskSegmentDto extends PartialType(CreateAssessmentRiskSegmentDto) { }
