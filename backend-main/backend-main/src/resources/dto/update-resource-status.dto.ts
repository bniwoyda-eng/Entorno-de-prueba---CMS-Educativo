import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ResourceStatus } from '../types';

export class UpdateResourceStatusDto {
    @ApiProperty({ description: 'Resource status', enum: ResourceStatus, example: ResourceStatus.PUBLISHED })
    @IsEnum(ResourceStatus, { message: `Resource status must be one of the following: ${Object.values(ResourceStatus).join(', ')}.`, })
    status: ResourceStatus;
}
