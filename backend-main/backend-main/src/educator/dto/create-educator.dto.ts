import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, IsUUID } from 'class-validator';

export class CreateEducatorDto {

    @ApiProperty({ description: 'Full name of the educator', type: String, minLength: 1, maxLength: 100, })
    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    fullName: string;

    @ApiProperty({ description: 'Email of the educator', type: String, minLength: 1, maxLength: 100, })
    @IsNotEmpty()
    @IsEmail()
    @Length(1, 100)
    email: string;

    @ApiProperty({ description: 'WhatsApp phone number of the educator', type: String, minLength: 1, maxLength: 100, })
    @IsNotEmpty()
    @IsString()
    @Length(1, 100)
    whatsappPhone: string;

    @ApiProperty({ description: 'ID of the institution to which the educator belongs', type: String, format: 'uuid', })
    @IsNotEmpty()
    @IsUUID()
    institutionId: string;

}
