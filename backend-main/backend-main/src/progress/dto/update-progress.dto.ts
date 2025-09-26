import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class UpdateProgressDto {
    @ApiProperty({ example: 120 })
    @IsNumber({}, { message: 'The last position (seconds) must be a number' })
    lastPosition: number;

    @ApiProperty({ example: true, default: false, required: false })
    @IsBoolean({ message: 'The finished status must be a boolean.' })
    @IsOptional()
    finished?: boolean = false;

    @ApiProperty({ example: 100, default: null, required: false })
    @IsNumber({}, { message: 'The score must be a number' })
    @IsOptional()
    score?: number = null;
}
