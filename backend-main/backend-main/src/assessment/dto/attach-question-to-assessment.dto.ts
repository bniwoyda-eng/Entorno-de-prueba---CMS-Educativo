import { IsNumber, IsUUID } from "class-validator";

export class AttachQuestionToAssessmentDto {
    @IsUUID()
    id_assessment: string;

    @IsUUID()
    id_assessment_question: string;

    @IsNumber()
    order: number;
}
