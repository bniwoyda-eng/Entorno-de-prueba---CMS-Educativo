import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { AssessmentQuestionPivotService } from './assessment-question-pivot.service';
import { AttachQuestionToAssessmentDto } from '../dto/attach-question-to-assessment.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AssessmentQuestionPivot } from '../entities';

@ApiTags('assessment-question-pivots')
@Controller('assessment-question-pivots')
export class AssessmentQuestionPivotController {
    constructor(private readonly assessmentQuestionPivotService: AssessmentQuestionPivotService) { }

    @Post()
    @ApiOperation({ summary: 'Attach a question to an assessment' })
    attach(@Body() dto: AttachQuestionToAssessmentDto) {
        return this.assessmentQuestionPivotService.attachQuestionToAssessment(dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Detach a question from an assessment' })
    detach(@Param('id', ParseUUIDPipe) id: string) {
        return this.assessmentQuestionPivotService.detachQuestionFromAssessment(id);
    }

    @Get(':assessmentId')
    @ApiOperation({ summary: 'Get all questions attached to an assessment' })
    getQuestionsByAssessmentId(@Param('assessmentId', ParseUUIDPipe) assessmentId: string) {
        return this.assessmentQuestionPivotService.getQuestionsByAssessmentId(assessmentId);
    }

    @Put(':assessmentId/reorder')
    @ApiOperation({ summary: 'Reorder questions attached to an assessment' })
    reorderQuestions(@Param('assessmentId', ParseUUIDPipe) assessmentId: string, @Body() questions: AssessmentQuestionPivot[]) {
        console.log(questions);
        return this.assessmentQuestionPivotService.reorderQuestions(assessmentId, questions);
    }
}
