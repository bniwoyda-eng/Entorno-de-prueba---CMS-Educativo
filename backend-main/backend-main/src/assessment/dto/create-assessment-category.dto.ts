import { IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAssessmentCategoryDto {
    @ApiProperty({ description: 'The name of the assessment category', example: 'Depression' })
    @IsString()
    @MaxLength(100)
    name: string;

}
