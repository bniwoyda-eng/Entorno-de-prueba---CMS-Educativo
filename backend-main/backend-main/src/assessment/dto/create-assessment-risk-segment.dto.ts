import { IsArray, IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
export class CreateAssessmentRiskSegmentDto {
    @ApiProperty({ description: 'The minimum score for the risk segment', example: 0 })
    @IsNumber()
    minScore: number;

    @ApiProperty({ description: 'The maximum score for the risk segment', example: 25 })
    @IsNumber()
    maxScore: number;

    @ApiProperty({ description: 'The recommendations for the risk segment', example: 'This is a recommendation' })
    @IsString()
    recommendations: string;
}

export class UpsertAssessmentRiskSegmentDto extends CreateAssessmentRiskSegmentDto {
    @IsOptional()
    @IsUUID()
    id?: string;
}

export class UpsertManyAssessmentRiskSegmentsDto {
    @ValidateNested({ each: true })
    @Type(() => UpsertAssessmentRiskSegmentDto)
    @IsArray()
    riskSegments: UpsertAssessmentRiskSegmentDto[];
}
