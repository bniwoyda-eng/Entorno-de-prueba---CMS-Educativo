import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Min, IsInt } from 'class-validator';

export class PaginationDto {
    @ApiProperty({ example: 1, description: 'Page number', required: false })
    @IsOptional()
    @IsInt({ message: 'Page must be an integer' })
    @Min(1)
    @Type(() => Number)
    page: number = 1;

    @ApiProperty({ example: 10, description: 'Limit per page', required: false })
    @IsOptional()
    @IsInt({ message: 'Limit must be an integer' })
    @Min(1)
    @Type(() => Number)
    limit: number = 10;
}
