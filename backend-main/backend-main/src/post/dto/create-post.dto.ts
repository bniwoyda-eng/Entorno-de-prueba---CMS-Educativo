import { Transform } from "class-transformer";
import { IsArray, IsOptional, IsString, IsUUID } from "class-validator";

export class CreatePostDto {
    @IsString()
    title: string;

    @IsString()
    content: string;

    @IsArray()
    @IsOptional()
    @IsUUID("4", { each: true })
    @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
    tagsIds: string[];
}
