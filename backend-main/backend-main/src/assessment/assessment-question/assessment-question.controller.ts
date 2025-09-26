import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AssessmentQuestionService } from './assessment-question.service';
import { CreateAssessmentQuestionDto, UpdateAssessmentQuestionDto, AssessmentQuestionFilterDto } from '../dto/index';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageFileFilter } from 'src/utils';

@ApiTags('assessment-questions')
@Controller('assessment-questions')
export class AssessmentQuestionController {
    constructor(private readonly assessmentQuestionService: AssessmentQuestionService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new assessment question' })
    create(@Body() dto: CreateAssessmentQuestionDto) {
        return this.assessmentQuestionService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all assessment questions' })
    findAll(@Query() query: AssessmentQuestionFilterDto) {
        return this.assessmentQuestionService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an assessment question by ID' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.assessmentQuestionService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update an assessment question by ID' })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAssessmentQuestionDto) {
        return this.assessmentQuestionService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an assessment question by ID' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.assessmentQuestionService.remove(id);
    }

    @Get(':assessmentId/available-questions')
    @ApiOperation({ summary: 'Get available questions for an assessment' })
    findAvailableQuestions(
        @Param('assessmentId', ParseUUIDPipe) assessmentId: string,
        @Query('search') search?: string
    ) {
        return this.assessmentQuestionService.findAvailableQuestions(assessmentId, search);
    }

    @Get(':id/image')
    @ApiOperation({ summary: 'Get the image of a question' })
    getQuestionImage(@Param('id', ParseUUIDPipe) id: string) {
        return this.assessmentQuestionService.getQuestionImage(id);
    }

    @Post(':id/image')
    @UseInterceptors(FileInterceptor('image', {
        fileFilter: imageFileFilter,
        limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
    }))
    @ApiOperation({ summary: 'Upload an image for a question' })
    uploadQuestionImage(@Param('id', ParseUUIDPipe) id: string, @UploadedFile() file: Express.Multer.File) {
        return this.assessmentQuestionService.uploadQuestionImage(id, file);
    }

    @Delete(':id/image')
    @ApiOperation({ summary: 'Remove the image of a question' })
    removeQuestionImage(@Param('id', ParseUUIDPipe) id: string) {
        return this.assessmentQuestionService.removeQuestionImage(id);
    }

}
