import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateQuizDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty({ message: 'The material ID is required.' })
    @IsUUID('4', { message: 'The material ID must be a valid UUID.' })
    materialId: string;

    @ApiProperty({ example: 'Quiz Title' })
    @IsNotEmpty({ message: 'The title is required.' })
    @IsString({ message: 'The title must be a string.' })
    title: string;

    @ApiProperty({ example: 'This is a description of the quiz.' })
    @IsString({ message: 'The description must be a string.' })
    description: string;
}
