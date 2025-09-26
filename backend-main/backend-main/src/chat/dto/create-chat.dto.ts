import { IsUUID } from 'class-validator';

export class CreateChatDto {
    @IsUUID()
    educatorId: string; // ID del otro docente con quien se desea iniciar el chat
}