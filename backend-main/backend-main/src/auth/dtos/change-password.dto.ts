import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
    @ApiProperty({
        example: 'test@csm.com',
        description: 'The email of the user',
    })
    @IsEmail({}, { message: 'Email is required and must be a valid email address' })
    email: string;

    @ApiProperty({
        description: 'The current password of the user',
    })
    @IsString()
    currentPassword: string;

    @ApiProperty({
        description: 'The new password of the user',
    })
    @IsString()
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(50, { message: 'Password cannot exceed 50 characters' })
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
            'Password must include at least one uppercase letter, one lowercase letter, and one number or special character.',
    })
    newPassword: string;
}
