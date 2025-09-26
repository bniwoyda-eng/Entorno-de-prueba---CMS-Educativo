import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { AssessmentGradient, TAssessmentGradient } from "../enums";

export class CreateAssessmentDto {
    @IsString()
    @ApiProperty({ description: 'The title of the assessment', example: 'Are you a good person?' })
    title: string;

    @IsString()
    @ApiProperty({ description: 'The description of the assessment', example: 'This assessment will help you understand your personality' })
    description: string;

    @IsUUID()
    @ApiProperty({ description: 'The ID of the assessment category', example: '123e4567-e89b-12d3-a456-426614174000' })
    id_assessment_category: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean = false;

    @IsOptional()
    @IsEnum(AssessmentGradient)
    gradient?: TAssessmentGradient;
}
