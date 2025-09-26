import { IsNotEmpty, IsUUID, IsArray, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateAnswerDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty({ message: 'The question ID is required.' })
    @IsUUID('4', { message: 'The question ID must be a valid UUID.' })
    questionId: string;

    @ApiProperty({ example: ['123e4567-e89b-12d3-a456-426614174000'] })
    @IsArray({ message: 'The selectedAnswerOptionIds must be an array.' })
    @ArrayNotEmpty({ message: 'The selectedAnswerOptionIds array must not be empty.' })
    @IsUUID('4', { each: true, message: 'Each selectedAnswerOptionId must be a valid UUID.' })
    selectedAnswerOptionIds: string[];
}
