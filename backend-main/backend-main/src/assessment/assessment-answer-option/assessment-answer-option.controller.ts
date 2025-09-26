import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { AssessmentAnswerOptionService } from './assessment-answer-option.service';
import { CreateAssessmentAnswerOptionDto, UpdateAssessmentAnswerOptionDto } from '../dto/index';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('assessment-answer-option')
@Controller('assessment-answer-option')
export class AssessmentAnswerOptionController {
    constructor(private readonly assessmentAnswerOptionService: AssessmentAnswerOptionService) { }

    @Post(':id_assessment_question')
    @ApiOperation({ summary: 'Create a new assessment answer option' })
    create(@Param('id_assessment_question', ParseUUIDPipe) id_assessment_question: string, @Body() dto: CreateAssessmentAnswerOptionDto) {
        return this.assessmentAnswerOptionService.create(id_assessment_question, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all assessment answer options' })
    findAll() {
        return this.assessmentAnswerOptionService.findAll();
    }

    @Get('/question/:id_assessment_question')
    @ApiOperation({ summary: 'Get all assessment answer options by assessment question ID' })
    findAllByAssessmentQuestion(@Param('id_assessment_question', ParseUUIDPipe) id_assessment_question: string) {
        return this.assessmentAnswerOptionService.findAllByAssessmentQuestion(id_assessment_question);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an assessment answer option by ID' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.assessmentAnswerOptionService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an assessment answer option by ID' })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAssessmentAnswerOptionDto) {
        return this.assessmentAnswerOptionService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an assessment answer option by ID' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.assessmentAnswerOptionService.remove(id);
    }
}
