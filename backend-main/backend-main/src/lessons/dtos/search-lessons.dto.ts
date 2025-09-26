import { IsOptional, IsString, IsUUID, IsInt, IsPositive } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AbstractPaginationQueryDto } from 'src/common/dtos';
import { Type } from 'class-transformer';

export class SearchLessonsDto extends AbstractPaginationQueryDto {
    @ApiPropertyOptional({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsOptional()
    @IsUUID('4', { message: 'The course ID must be a valid UUID.' })
    courseId?: string;

    @ApiPropertyOptional({ example: 'Introduction to Programming' })
    @IsOptional()
    @IsString({ message: 'The title must be a string.' })
    title?: string;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt({ message: 'The sequence must be an integer.' })
    @IsPositive({ message: 'The sequence must be a positive integer.' })
    @Type(() => Number)
    sequence?: number;
}
