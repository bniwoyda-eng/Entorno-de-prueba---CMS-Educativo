import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsObject, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from "src/common";
import { ResourceType } from '../types';
import { ApiProperty } from '@nestjs/swagger';


export class ResourceFilterDto extends PaginationDto {
    @ApiProperty({ description: 'Search term for filtering resources', required: false })
    @IsOptional()
    @IsString({ message: 'textSearch must be a string' })
    textSearch?: string;

    @ApiProperty({ type: ResourceType, description: 'Type of resource', required: false, enum: ResourceType })
    @IsOptional()
    @IsEnum(ResourceType, { message: 'Type must be a valid resource type' })
    resourceType?: string;

    @ApiProperty({ type: [String], description: 'Sorting configuration (e.g., -creation_date)', required: false })
    @IsOptional()
    @IsArray({ message: 'Sort must be an array of strings' })
    @IsString({ each: true, message: 'Each sort entry must be a string' })
    sort?: string[];

}
