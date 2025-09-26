import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEnrollmentDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty({ message: 'The student ID is required.' })
    @IsUUID('4', { message: 'The student ID must be a valid UUID.' })
    studentId: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty({ message: 'The course ID is required.' })
    @IsUUID('4', { message: 'The course ID must be a valid UUID.' })
    courseId: string;
}
