import {
    IsNotEmpty,
    IsUUID,
    IsArray,
    ArrayNotEmpty,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AnswerDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty({ message: 'The question ID is required.' })
    @IsUUID('4', { message: 'The question ID must be a valid UUID.' })
    questionId: string;

    @ApiProperty({ example: ['123e4567-e89b-12d3-a456-426614174000'] })
    @IsArray({ message: 'The selectedOptionsIds must be an array.' })
    @ArrayNotEmpty({ message: 'The selectedOptionsIds array must not be empty.' })
    @IsUUID('4', { each: true, message: 'Each selectedOptionsIds must be a valid UUID.' })
    selectedOptionsIds: string[];
}

export class CheckQuizDto {

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty({ message: 'The material ID is required.' })
    @IsUUID('4', { message: 'The material ID must be a valid UUID.' })
    materialId: string;

    @ApiProperty({
        type: [AnswerDto],
        example: [
            {
                questionId: '123e4567-e89b-12d3-a456-426614174000',
                selectedOptionsIds: ['123e4567-e89b-12d3-a456-426614174000'],
            },
        ],
    })
    @IsArray({ message: 'Answers must be an array.' })
    @ArrayNotEmpty({ message: 'Answers must not be empty.' })
    @ValidateNested({ each: true })
    @Type(() => AnswerDto)
    answers: AnswerDto[];
}
