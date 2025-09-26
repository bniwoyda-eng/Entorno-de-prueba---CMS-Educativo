import { PartialType } from '@nestjs/swagger';
import { CreateAssessmentQuestionDto } from './create-assessment-question.dto';

export class UpdateAssessmentQuestionDto extends PartialType(CreateAssessmentQuestionDto) { }
