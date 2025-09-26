import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { AssessmentCategoryService } from './assessment-category.service';
import { CreateAssessmentCategoryDto, UpdateAssessmentCategoryDto } from '../dto/index';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('assessment-categories')
@Controller('assessment-categories')
export class AssessmentCategoryController {
    constructor(private readonly assessmentCategoryService: AssessmentCategoryService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new assessment category' })
    create(@Body() dto: CreateAssessmentCategoryDto) {
        return this.assessmentCategoryService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all assessment categories' })
    findAll() {
        return this.assessmentCategoryService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an assessment category by ID' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.assessmentCategoryService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an assessment category by ID' })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAssessmentCategoryDto) {
        return this.assessmentCategoryService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an assessment category by ID' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.assessmentCategoryService.remove(id);
    }
}
