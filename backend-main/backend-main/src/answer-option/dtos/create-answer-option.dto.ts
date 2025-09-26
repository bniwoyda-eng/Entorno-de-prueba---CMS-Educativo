import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerOptionDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty({ message: 'The question ID is required.' })
    @IsUUID('4', { message: 'The question ID must be a valid UUID.' })
    questionId: string;

    @ApiProperty({ example: 'Paris' })
    @IsNotEmpty({ message: 'The option text is required.' })
    @IsString({ message: 'The option text must be a string.' })
    option: string;
}