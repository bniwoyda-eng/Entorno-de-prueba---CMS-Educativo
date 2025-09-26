import {
    IsEmail,
    IsString,
    IsUUID,
    Matches,
    MaxLength,
    MinLength,
    IsOptional,
    IsArray,
    ArrayNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidRoles } from 'src/auth/interfaces';

export class CreateUserDto {
    @ApiProperty({
        example: 'test@csm.com',
        description: 'The email of the user',
    })
    @IsEmail({}, { message: 'Email is required and must be a valid email address' })
    email: string;

    @ApiProperty({
        example: 'esDificil123',
        description: 'The password of the user',
    })
    @IsString({ message: 'Password is required' })
    @MinLength(8, { message: 'Password must be at least 8 characters long' })
    @MaxLength(50, { message: 'Password cannot exceed 50 characters' })
    @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message:
            'Password must include at least 8 characters, one uppercase letter, one lowercase letter, and one number.',
    })
    password: string;

    @ApiProperty({
        example: 'John Fox',
        description: 'The full name of the user',
    })
    @IsString({ message: 'Full name is required' })
    @MinLength(3, { message: 'Full name must be at least 3 characters long' })
    fullName: string;

    @ApiProperty({
        example: '00000000-0000-0000-0000-000000000000',
        description: 'The tenant ID of the user',
    })
    @IsUUID('4', { message: 'Tenant ID must be a valid UUID' })
    tenantId: string;

    @ApiPropertyOptional({
        example: '123',
        description: 'The ID of the related employee',
        required: false,
    })
    @IsOptional()
    @IsUUID('4', { message: 'Employee ID must be a valid UUID' })
    employeeId?: string;

    @ApiPropertyOptional({
        example: '123',
        description: 'The ID of the related student',
        required: false,
    })
    @IsOptional()
    @IsUUID('4', { message: 'Student ID must be a valid UUID' })
    studentId?: string;

    @ApiPropertyOptional({
        example: [ValidRoles.admin],
        description: 'The roles of the user',
        required: false,
        enum: ValidRoles,
        isArray: true,
    })
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty({ message: 'Roles array must not be empty' })
    roles?: ValidRoles[];
}
