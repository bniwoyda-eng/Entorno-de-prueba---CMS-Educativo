import { PartialType } from '@nestjs/swagger';
import { CreateResourceAttachmentDto } from './create-resource-attachment.dto';

export class UpdateResourceAttachmentDto extends PartialType(CreateResourceAttachmentDto) { }
