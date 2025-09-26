import { IsInt, IsString, Max, Min, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
export class CreateAssessmentAnswerOptionDto {

    @ApiProperty({ description: 'The text of the answer option', example: 'Option 1' })
    @IsString()
    answerText: string;

    @ApiProperty({ description: 'The score of the answer option', example: 10 })
    @IsInt()
    @Min(0)
    @Max(100)
    score: number;
}
