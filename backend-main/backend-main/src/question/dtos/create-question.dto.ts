import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionType } from '../enums';

export class CreateQuestionDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty({ message: 'The quiz ID is required.' })
    @IsUUID('4', { message: 'The quiz ID must be a valid UUID.' })
    quizId: string;

    @ApiProperty({ example: 'What is the capital of France?' })
    @IsNotEmpty({ message: 'The question text is required.' })
    @IsString({ message: 'The question text must be a string.' })
    text: string;

    @ApiProperty({ example: QuestionType.SINGLE, enum: QuestionType })
    @IsNotEmpty({ message: 'The question type is required.' })
    @IsEnum(QuestionType, { message: 'The question type must be a valid enum value.' })
    type: QuestionType;
}
