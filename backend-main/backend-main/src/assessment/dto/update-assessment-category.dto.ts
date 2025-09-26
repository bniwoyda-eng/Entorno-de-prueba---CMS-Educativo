import { PartialType } from '@nestjs/swagger';
import { CreateAssessmentCategoryDto } from './create-assessment-category.dto';

export class UpdateAssessmentCategoryDto extends PartialType(CreateAssessmentCategoryDto) { }
