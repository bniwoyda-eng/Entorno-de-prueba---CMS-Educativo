import { IsNotEmpty, IsString, IsInt, IsPositive, IsUUID, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLessonDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty({ message: 'The course ID is required.' })
    @IsUUID('4', { message: 'The course ID must be a valid UUID.' })
    courseId: string;

    @ApiProperty({ example: 'Introduction to Programming' })
    @IsNotEmpty({ message: 'The title is required.' })
    @IsString({ message: 'The title must be a string.' })
    title: string;

    @ApiProperty({ example: 'This lesson covers the basics of programming.' })
    @IsNotEmpty({ message: 'The description is required.' })
    @IsString({ message: 'The description must be a string.' })
    description: string;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt({ message: 'The sequence must be an integer.' })
    @IsPositive({ message: 'The sequence must be a positive integer.' })
    sequence?: number;
}
