import { PartialType } from '@nestjs/swagger';
import { CreateAssessmentAnswerOptionDto } from './create-assessment-answer-option.dto';

export class UpdateAssessmentAnswerOptionDto extends PartialType(CreateAssessmentAnswerOptionDto) { }
