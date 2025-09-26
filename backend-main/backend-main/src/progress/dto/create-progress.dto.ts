import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsOptional, IsPositive, IsNumber } from 'class-validator';

export class CreateProgressDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty({ message: 'The material ID is required.' })
    @IsUUID('4', { message: 'The material ID must be a valid UUID.' })
    materialId: string;

    @ApiPropertyOptional({ example: 10.5 })
    @IsOptional()
    @IsNumber({}, { message: 'The last position must be a number.' })
    @IsPositive({ message: 'The last position must be a positive number.' })
    lastPosition?: number;
}
