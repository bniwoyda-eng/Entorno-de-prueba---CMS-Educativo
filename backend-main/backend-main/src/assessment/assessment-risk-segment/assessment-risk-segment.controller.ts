import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { CreateAssessmentRiskSegmentDto, UpdateAssessmentRiskSegmentDto, UpsertManyAssessmentRiskSegmentsDto } from '../dto/index';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AssessmentRiskSegmentService } from './assessment-risk-segment.service';

@ApiTags('assessment-risk-segments')
@Controller('assessment-risk-segments')
export class AssessmentRiskSegmentController {
    constructor(private readonly assessmentRiskSegmentService: AssessmentRiskSegmentService) { }

    @Post(':id_assessment')
    @ApiOperation({ summary: 'Create a new risk segment for an assessment' })
    create(@Param('id_assessment', ParseUUIDPipe) id_assessment: string, @Body() dto: CreateAssessmentRiskSegmentDto) {
        return this.assessmentRiskSegmentService.create(id_assessment, dto);
    }

    @Post('by-assessment/:id_assessment')
    @ApiOperation({ summary: 'Create multiple risk segments for an assessment' })
    upsertMany(@Param('id_assessment', ParseUUIDPipe) id_assessment: string, @Body() dto: UpsertManyAssessmentRiskSegmentsDto) {
        return this.assessmentRiskSegmentService.upsertMany(id_assessment, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all risk segments for all assessments' })
    findAll() {
        return this.assessmentRiskSegmentService.findAll();
    }

    @Get('/by-assessment/:id_assessment')
    @ApiOperation({ summary: 'Get all risk segments for an assessment' })
    findAllByAssessment(@Param('id_assessment', ParseUUIDPipe) id_assessment: string) {
        return this.assessmentRiskSegmentService.findAllByAssessment(id_assessment);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a risk segment by ID' })
    findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.assessmentRiskSegmentService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a risk segment by ID' })
    update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAssessmentRiskSegmentDto) {
        return this.assessmentRiskSegmentService.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a risk segment by ID' })
    remove(@Param('id', ParseUUIDPipe) id: string) {
        return this.assessmentRiskSegmentService.remove(id);
    }
}
