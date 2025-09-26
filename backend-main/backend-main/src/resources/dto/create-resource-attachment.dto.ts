import { IsInt, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateResourceAttachmentDto {
    @IsString({ message: 'MIME type must be a string.' })
    mimetype: string;

    @IsString({ message: 'File name must be a string.' })
    name: string;

    @IsUrl({}, { message: 'URL must be a valid URL.' })
    url: string;

    @IsOptional()
    @IsInt({ message: 'Download count must be an integer.' })
    downloads: number;
}
