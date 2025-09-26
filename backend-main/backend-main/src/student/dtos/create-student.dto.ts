import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
    @ApiProperty({ example: 'John Doe' })
    @IsNotEmpty({ message: 'The full name is required.' })
    @IsString({ message: 'The full name must be a string.' })
    fullName: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    @IsNotEmpty({ message: 'The email is required.' })
    @IsEmail({}, { message: 'Email is required and must be a valid email address' })
    email: string;

    @ApiProperty({ example: '+1234567890' })
    @IsNotEmpty({ message: 'The WhatsApp phone is required.' })
    @IsString({ message: 'The WhatsApp phone must be a string.' })
    whatsappPhone: string;

    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty({ message: 'The educational institution ID is required.' })
    @IsUUID('4', { message: 'The educational institution ID must be a valid UUID.' })
    institutionId: string;
}
