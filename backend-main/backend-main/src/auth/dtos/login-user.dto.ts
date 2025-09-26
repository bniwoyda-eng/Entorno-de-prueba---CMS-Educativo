import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
    @ApiProperty({
        example: 'educator@correo.com',
        description: 'The email of the user',
    })
    @IsEmail({}, { message: 'Email is required and must be a valid email address' })
    email: string;

    @ApiProperty({
        example: 'Password123',
        description: 'The password of the user',
    })
    @IsString({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(50, { message: 'Password cannot exceed 50 characters' })
    password: string;
}
