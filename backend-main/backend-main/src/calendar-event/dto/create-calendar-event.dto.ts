import { Transform } from "class-transformer";
import { IsArray, IsDate, IsOptional, IsString, IsUrl, IsUUID, Min, MinDate } from "class-validator";
import { IsFutureDate } from "src/common";

export class CreateCalendarEventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  // @IsDate()
  // @IsFutureDate({ message: 'La fecha de inicio debe estar en el futuro' })
  @IsString()
  startDate: Date;
  
  // @IsDate()
  // @IsFutureDate({ message: 'La fecha de fin debe estar en el futuro' })
  @IsString()
  endDate: Date;

  @IsString()
  @IsOptional()
  // @IsUrl()
  eventUrl: string;

  @IsArray()
  @IsOptional()
  @IsUUID("4", { each: true })
  @Transform(({ value }) => typeof value === 'string' ? JSON.parse(value) : value)
  tagsIds: string[];
}
