import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsUUID, IsArray, ValidateNested, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class AssessmentAnswerDto {
    @ApiProperty({ description: 'ID of the question' })
    @IsUUID()
    questionId: string;

    @ApiProperty({ description: 'ID of the selected answer option' })
    @IsUUID()
    answerId: string;

    @ApiProperty({ description: 'Score of the selected answer' })
    @IsNumber()
    score: number;
}

export class AssessmentEvaluationDto {
    @ApiProperty({ description: 'ID of the assessment being evaluated' })
    @IsUUID()
    assessmentId: string;

    @ApiProperty({ 
        description: 'Array of user answers',
        type: [AssessmentAnswerDto]
    })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AssessmentAnswerDto)
    answers: AssessmentAnswerDto[];

    @ApiProperty({ description: 'Total score calculated', required: false })
    @IsOptional()
    @IsNumber()
    totalScore?: number;

    @ApiProperty({ description: 'Maximum possible score for this assessment', required: false })
    @IsOptional()
    @IsNumber()
    maxPossibleScore?: number;
}

export class AssessmentEvaluationResultDto {
    @ApiProperty({ description: 'ID of the assessment' })
    assessmentId: string;

    @ApiProperty({ description: 'Total score achieved' })
    totalScore: number;

    @ApiProperty({ description: 'Maximum possible score' })
    maxPossibleScore: number;

    @ApiProperty({ description: 'Percentage score' })
    percentage: number;

    @ApiProperty({ description: 'Risk segment information', required: false })
    riskSegment?: {
        id: string;
        minScore: number;
        maxScore: number;
        recommendations?: string;
    };

    @ApiProperty({ description: 'User answers provided' })
    answers: AssessmentAnswerDto[];
} 