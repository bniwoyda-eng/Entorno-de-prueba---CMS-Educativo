import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsUUID, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC'
}

export enum SortField {
    TITLE = 'title',
    CREATED_AT = 'created_at',
    ATTEMPTS = 'attempts'
}

export class AssessmentFilterDto {
    @ApiProperty({ description: 'Search term for filtering assessments by title or description', required: false })
    @IsOptional()
    @IsString({ message: 'search must be a string' })
    search?: string;

    @ApiProperty({ description: 'Filter by visibility (active/inactive)', required: false })
    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsBoolean({ message: 'isActive must be a boolean' })
    isActive?: boolean;

    @ApiProperty({ description: 'Filter by assessment category ID', required: false })
    @IsOptional()
    @IsUUID(4, { message: 'categoryId must be a valid UUID' })
    categoryId?: string;

    @ApiProperty({ 
        description: 'Field to sort by', 
        enum: SortField, 
        required: false,
        default: SortField.CREATED_AT 
    })
    @IsOptional()
    @IsEnum(SortField, { message: 'sortBy must be either "title", "created_at" or "attempts"' })
    sortBy?: SortField = SortField.CREATED_AT;

    @ApiProperty({ 
        description: 'Sort order', 
        enum: SortOrder, 
        required: false,
        default: SortOrder.DESC 
    })
    @IsOptional()
    @IsEnum(SortOrder, { message: 'sortOrder must be either "ASC" or "DESC"' })
    sortOrder?: SortOrder = SortOrder.DESC;
} 