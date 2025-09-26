import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from 'src/common';

export class AssessmentQuestionFilterDto extends PaginationDto {
    @ApiProperty({ description: 'Search term for filtering questions', required: false })
    @IsOptional()
    @IsString({ message: 'search must be a string' })
    search?: string;
} 