import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto, UpdateAnswerDto } from './dtos';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Answer } from './entities/answers.entity';
import { AbstractResponse } from 'src/common/interfaces';

@ApiTags('Answers')
@ApiBearerAuth()
@Controller('answers')
export class AnswerController {
    constructor(private readonly answerService: AnswerService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new answer' })
    @ApiResponse({
        status: 201,
        description: 'Answer created',
        type: Answer,
    })
    create(@Body() createAnswerDto: CreateAnswerDto): Promise<AbstractResponse<Answer[]>> {
        return this.answerService.create(createAnswerDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all answers' })
    @ApiResponse({
        status: 200,
        description: 'List of all answers',
        type: [Answer],
    })
    findAll(): Promise<AbstractResponse<Answer[]>> {
        return this.answerService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an answer by id' })
    @ApiResponse({
        status: 200,
        description: 'The answer with the given ID',
        type: Answer,
    })
    findOne(@Param('id') id: string): Promise<AbstractResponse<Answer>> {
        return this.answerService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an answer by id' })
    @ApiResponse({
        status: 200,
        description: 'The answer has been successfully updated',
        type: Answer,
    })
    update(@Param('id') id: string, @Body() updateAnswerDto: UpdateAnswerDto): Promise<AbstractResponse<Answer[]>> {
        return this.answerService.update(id, updateAnswerDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an answer by id' })
    @ApiResponse({ status: 204, description: 'The answer has been successfully deleted' })
    remove(@Param('id') id: string): Promise<AbstractResponse<void>> {
        return this.answerService.remove(id);
    }
}
