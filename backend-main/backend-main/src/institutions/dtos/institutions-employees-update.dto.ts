import { PartialType } from '@nestjs/swagger';
import { InstitutionEmployeesCreateDto } from '.';

export class InstitutionEmployeesUpdateDto extends PartialType(InstitutionEmployeesCreateDto) {}
