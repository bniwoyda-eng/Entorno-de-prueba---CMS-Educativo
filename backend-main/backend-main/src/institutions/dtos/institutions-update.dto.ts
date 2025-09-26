import { PartialType } from '@nestjs/swagger';
import { InstitutionsCreateDto } from './institutions-create.dto';

export class InstitutionsUpdateDto extends PartialType(InstitutionsCreateDto) {}
