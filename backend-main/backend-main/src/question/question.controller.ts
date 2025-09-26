import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto, UpdateQuestionDto } from './dtos';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Question } from './entities/questions.entity';
import { AbstractResponse } from 'src/common/interfaces';

@ApiTags('Questions')
@ApiBearerAuth()
@Controller('questions')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new question' })
    @ApiResponse({
        status: 201,
        description: 'Question created',
        type: Question,
    })
    create(@Body() createQuestionDto: CreateQuestionDto): Promise<AbstractResponse<Question>> {
        return this.questionService.create(createQuestionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all questions' })
    @ApiResponse({
        status: 200,
        description: 'List of all questions',
        type: [Question],
    })
    findAll(): Promise<AbstractResponse<Question[]>> {
        return this.questionService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a question by id' })
    @ApiResponse({
        status: 200,
        description: 'The question with the given ID',
        type: Question,
    })
    findOne(@Param('id') id: string): Promise<AbstractResponse<Question>> {
        return this.questionService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a question by id' })
    @ApiResponse({
        status: 200,
        description: 'The question has been successfully updated',
        type: Question,
    })
    update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto): Promise<AbstractResponse<Question>> {
        return this.questionService.update(id, updateQuestionDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a question by id' })
    @ApiResponse({ status: 204, description: 'The question has been successfully deleted' })
    remove(@Param('id') id: string): Promise<AbstractResponse<void>> {
        return this.questionService.remove(id);
    }
}
