import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RequestPasswordRecoveryDto {
    @ApiProperty({
        example: 'test@csm.com',
        description: 'The email of the user',
    })
    @IsEmail({}, { message: 'Email is required and must be a valid email address' })
    email: string;
}
