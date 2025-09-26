import { IsString } from 'class-validator';

export class CreatePostCommentDto {
    @IsString({ message: 'Comment is required and must be a string.' })
    comment: string;
}
