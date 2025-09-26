import { IsOptional, IsString } from "class-validator";
import { PaginationDto } from "src/common";

export class PostsQueryDto extends PaginationDto {
    @IsString()
    @IsOptional()
    tag: string;
}