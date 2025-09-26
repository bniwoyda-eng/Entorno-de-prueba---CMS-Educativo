import { IsBooleanString, IsIn, IsOptional, IsString } from 'class-validator';

export class CalendarEventQueryDto {
    @IsString()
    @IsOptional()
    tag?: string;

    @IsBooleanString()
    @IsOptional()
    incoming?: string; 

    @IsIn(['all', 'global', 'institution', 'personal'])
    @IsOptional()
    filter?: 'all' | 'global' | 'institution' | 'personal';
}
