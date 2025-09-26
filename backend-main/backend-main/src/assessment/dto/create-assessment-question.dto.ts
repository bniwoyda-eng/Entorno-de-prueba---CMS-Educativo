import { IsEnum, IsInt, IsOptional, IsString, IsUrl, Max, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAssessmentQuestionDto {
    @ApiProperty({ description: 'The text of the question', example: 'If your friend is in danger, what would you do?' })
    @IsString()
    questionText: string;

    @ApiProperty({ description: 'The image of the question', example: 'https://placehold.co/800x400' })
    @IsOptional()
    @IsUrl()
    questionImage?: string;
}
