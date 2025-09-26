import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { AttachQuestionToAssessmentDto } from "./attach-question-to-assessment.dto";

export class UpdateAssessmentQuestionOrderDto {
    @ValidateNested({ each: true })
    @Type(() => AttachQuestionToAssessmentDto)
    questions: AttachQuestionToAssessmentDto[];
}
