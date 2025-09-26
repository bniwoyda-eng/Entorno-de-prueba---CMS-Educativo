import { IsNotEmpty, IsString, IsInt, IsPositive, IsUrl, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum Level {
    BASIC = 'BASIC',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED',
}

export class CreateCourseDto {
    @ApiProperty({ example: 'Introduction to Programming' })
    @IsNotEmpty({ message: 'The title is required.' })
    @IsString({ message: 'The title must be a string.' })
    title: string;

    @ApiProperty({ example: 'This course covers the basics of programming.' })
    @IsNotEmpty({ message: 'The description is required.' })
    @IsString({ message: 'The description must be a string.' })
    description: string;

    @ApiProperty({ example: 'Level' })
    @IsOptional()
    @IsEnum(Level, { message: 'The level must be either BASIC, INTERMEDIATE, or ADVANCED.' })
    level: Level = Level.BASIC;

    @ApiProperty({ example: 'http://example.com/image1.jpg' })
    @IsUrl({}, { each: true, message: 'Each image URL must be a valid URL.' })
    imageUrl: string;

    @ApiProperty({ example: 'http://example.com/video1.mp4' })
    @IsUrl({}, { each: true, message: 'Each video URL must be a valid URL.' })
    videoUrl: string;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @IsInt({ message: 'The sequence must be an integer.' })
    @IsPositive({ message: 'The sequence must be a positive integer.' })
    sequence?: number;
}
