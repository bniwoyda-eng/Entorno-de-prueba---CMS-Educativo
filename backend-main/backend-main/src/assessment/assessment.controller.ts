import { ApiOperation, ApiTags, ApiQuery } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Put, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { CreateAssessmentDto, UpdateAssessmentDto, AssessmentFilterDto, AssessmentEvaluationDto } from './dto/index';
import { AssessmentService } from './assessment.service';
import { Auth, GetUser, ValidRoles } from 'src/auth';
import { User } from 'src/exports/entities';

@ApiTags('assessments')
@Controller('assessments')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new assessment' })
  create(@Body() dto: CreateAssessmentDto) {
    return this.assessmentService.create(dto);
  }

  @Post('evaluate')
  @ApiOperation({ summary: 'Evaluate a self-assessment based on user answers' })
  evaluate(@Body() dto: AssessmentEvaluationDto) {
    return this.assessmentService.evaluateAssessment(dto);
  }

  @Get('top-by-attempts')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Get assessments ordered by attempts count (for admin dashboard)' })
  @ApiQuery({ name: 'order', enum: ['ASC', 'DESC'], required: false, description: 'Sort order: ASC for least attempts, DESC for most attempts' })
  @ApiQuery({ name: 'limit', type: 'number', required: false, description: 'Maximum number of assessments to return (default: 10)' })
  findTopByAttempts(
    @Query('order') order: 'ASC' | 'DESC' = 'DESC',
    @Query('limit') limit: string = '10'
  ) {
    const limitNumber = parseInt(limit) || 10;
    return this.assessmentService.findTopByAttempts(order, limitNumber);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.student)
  @ApiOperation({ summary: 'Get all assessments' })
  findAll(@Query() query: AssessmentFilterDto, @GetUser() user: User) {
    return this.assessmentService.findAll(query, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an assessment by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.assessmentService.findOne(id);
  }

  @Get(':id/questions')
  @Auth(ValidRoles.admin, ValidRoles.student)
  @ApiOperation({ summary: 'Get an assessment by ID with questions' })
  findOneWithQuestions(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.assessmentService.findOneWithQuestions(id, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an assessment by ID' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAssessmentDto) {
    return this.assessmentService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an assessment by ID' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.assessmentService.remove(id);
  }
}
