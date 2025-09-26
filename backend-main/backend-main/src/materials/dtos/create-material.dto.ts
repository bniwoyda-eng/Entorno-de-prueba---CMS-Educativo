// import {
//     IsNotEmpty,
//     IsString,
//     IsInt,
//     IsPositive,
//     IsUUID,
//     IsOptional,
//     IsUrl,
//     IsEnum,
//     ValidateIf,
// } from 'class-validator';
// import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
// import { MaterialType } from '../enums/material-type.enum';

// export class CreateMaterialDto {
//     @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
//     @IsNotEmpty({ message: 'The lesson ID is required.' })
//     @IsUUID('4', { message: 'The lesson ID must be a valid UUID.' })
//     lessonId: string;

//     @ApiProperty({ example: 'video', enum: MaterialType })
//     @IsNotEmpty({ message: 'The type is required.' })
//     @IsEnum(MaterialType, { message: 'The type must be a valid material type.' })
//     type: MaterialType;

//     @ApiProperty({ example: 'Introduction to Programming' })
//     @IsNotEmpty({ message: 'The title is required.' })
//     @IsString({ message: 'The title must be a string.' })
//     title: string;

//     @ApiProperty({ example: 'http://example.com/video.mp4' })
//     @IsNotEmpty({ message: 'The URL is required.' })
//     @IsUrl({}, { message: 'The URL must be a valid URL.' })
//     url: string;

//     @ApiPropertyOptional({ example: 120 })
//     @ValidateIf((o) => o.type === MaterialType.video)
//     @IsNotEmpty({ message: 'The duration is required for video materials.' })
//     @IsInt({ message: 'The duration must be an integer.' })
//     @IsPositive({ message: 'The duration must be a positive integer.' })
//     duration?: number;

//     @ApiPropertyOptional({ example: 15.5 })
//     @ValidateIf((o) => o.type === MaterialType.video)
//     @IsNotEmpty({ message: 'The size is required for video materials.' })
//     @IsPositive({ message: 'The size must be a positive number.' })
//     size?: number;

//     @ApiPropertyOptional({ example: 1 })
//     @IsOptional()
//     @IsInt({ message: 'The sequence must be an integer.' })
//     @IsPositive({ message: 'The sequence must be a positive integer.' })
//     sequence?: number;
// }

import {
    IsNotEmpty,
    IsString,
    IsInt,
    IsPositive,
    IsUUID,
    IsOptional,
    IsUrl,
    IsEnum,
    ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MaterialType } from '../enums/material-type.enum';

export class CreateMaterialDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsNotEmpty({ message: 'The lesson ID is required.' })
    @IsUUID('4', { message: 'The lesson ID must be a valid UUID.' })
    lessonId: string;

    @ApiProperty({ example: 'video', enum: MaterialType })
    @IsNotEmpty({ message: 'The type is required.' })
    @IsEnum(MaterialType, { message: 'The type must be a valid material type.' })
    type: MaterialType;

    @ApiProperty({ example: 'Introduction to Programming' })
    @IsNotEmpty({ message: 'The title is required.' })
    @IsString({ message: 'The title must be a string.' })
    title: string;

    @ApiPropertyOptional({ example: 'http://example.com/video.mp4' })
    @ValidateIf((o) => o.type !== MaterialType.quiz)
    @IsNotEmpty({ message: 'The URL is required unless the material type is quiz.' })
    @IsUrl({}, { message: 'The URL must be a valid URL.' })
    url?: string;

    @ApiPropertyOptional({ example: 120 })
    @ValidateIf((o) => o.type === MaterialType.video)
    @IsNotEmpty({ message: 'The duration is required for video materials.' })
    @IsInt({ message: 'The duration must be an integer.' })
    @IsPositive({ message: 'The duration must be a positive integer.' })
    duration?: number;

    @ApiPropertyOptional({ example: 15.5 })
    @ValidateIf((o) => o.type === MaterialType.video)
    @IsNotEmpty({ message: 'The size is required for video materials.' })
    @IsPositive({ message: 'The size must be a positive number.' })
    size?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt({ message: 'The sequence must be an integer.' })
    @IsPositive({ message: 'The sequence must be a positive integer.' })
    sequence?: number;
}