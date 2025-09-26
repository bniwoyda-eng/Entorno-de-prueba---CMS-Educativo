import { IsNotEmpty, MaxLength } from 'class-validator';

export class SendMessageDto {
    @IsNotEmpty()
    @MaxLength(500)
    message: string;
}
