import { IsEnum, IsInt, IsOptional, IsString, IsUrl } from 'class-validator';
import { ResourceStatus, ResourceType } from '../types/';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResourceDto {

    @ApiProperty({ description: 'Resource type', enum: ResourceType, example: ResourceType.ARTICLE })
    @IsEnum(ResourceType, { message: `Resource type must be one of the following: ${Object.values(ResourceType).join(', ')}.`, })
    type: ResourceType;

    @ApiProperty({ description: 'Resource status', enum: ResourceStatus, example: ResourceStatus.PUBLISHED })
    @IsEnum(ResourceStatus, { message: `Resource status must be one of the following: ${Object.values(ResourceStatus).join(', ')}.`, })
    status: ResourceStatus;

    @ApiProperty({ description: 'Resource thumbnail url', example: 'https://placehold.co/400x200?text=Thumbnail' })
    @IsOptional()
    @IsUrl({}, { message: 'Thumbnail URL must be a valid URL.' })
    thumbnailUrl?: string;

    @ApiProperty({ description: 'Resource title', example: 'Understanding TypeScript' })
    @IsString({ message: 'Title is required and must be a string.' })
    title: string;

    @ApiProperty({ description: 'Extract of the resource', example: 'A brief overview of TypeScript features.' })
    @IsString({ message: 'Extract is required and must be a string.' })
    extract: string;

    @IsOptional()
    @IsUrl({}, { message: 'Content URL must be a valid URL.' })
    contentUrl?: string;

    @ApiProperty({ description: 'Resource paragraphs', example: 'Detailed explanation of TypeScript features.' })
    @IsOptional()
    @IsString({ each: true, message: 'Paragraphs must be an array of strings.' })
    paragraphs?: string[];

    @IsOptional()
    @IsInt({ message: 'Duration (minutes) must be an integer.' })
    mins_duration: number;

    @IsOptional()
    @IsInt({ message: 'Views must be an integer.' })
    views: number;

    @IsOptional()
    @IsInt({ message: 'Sequence must be an integer.' })
    sequence: number;

}
