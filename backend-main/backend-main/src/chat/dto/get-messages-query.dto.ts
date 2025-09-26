import { IsOptional, IsInt, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class GetMessagesQueryDto {
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    limit?: number;

    @IsOptional()
    @IsUUID()
    before?: string; // UUID del mensaje más antiguo ya cargado
}
