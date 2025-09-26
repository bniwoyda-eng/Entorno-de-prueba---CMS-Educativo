import { IsString } from 'class-validator';

export class CreateResourceCommentDto {
    @IsString({ message: 'Comment is required and must be a string.' })
    comment: string;
}
