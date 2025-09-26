import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AnswerOptionService } from './answer-option.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AnswerOptions } from './entities/answer-options.entity';
import { AbstractResponse } from 'src/common/interfaces';
import { CreateAnswerOptionDto, UpdateAnswerOptionDto } from './dtos';

@ApiTags('AnswerOptions')
@ApiBearerAuth()
@Controller('answer-options')
export class AnswerOptionController {
    constructor(private readonly answerOptionService: AnswerOptionService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new answer option' })
    @ApiResponse({
        status: 201,
        description: 'Answer option created',
        type: AnswerOptions,
    })
    create(@Body() createAnswerOptionDto: CreateAnswerOptionDto): Promise<AbstractResponse<AnswerOptions>> {
        return this.answerOptionService.create(createAnswerOptionDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all answer options' })
    @ApiResponse({
        status: 200,
        description: 'List of all answer options',
        type: [AnswerOptions],
    })
    findAll(): Promise<AbstractResponse<AnswerOptions[]>> {
        return this.answerOptionService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an answer option by id' })
    @ApiResponse({
        status: 200,
        description: 'The answer option with the given ID',
        type: AnswerOptions,
    })
    findOne(@Param('id') id: string): Promise<AbstractResponse<AnswerOptions>> {
        return this.answerOptionService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an answer option by id' })
    @ApiResponse({
        status: 200,
        description: 'The answer option has been successfully updated',
        type: AnswerOptions,
    })
    update(
        @Param('id') id: string,
        @Body() updateAnswerOptionDto: UpdateAnswerOptionDto
    ): Promise<AbstractResponse<AnswerOptions>> {
        return this.answerOptionService.update(id, updateAnswerOptionDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an answer option by id' })
    @ApiResponse({ status: 204, description: 'The answer option has been successfully deleted' })
    remove(@Param('id') id: string): Promise<AbstractResponse<void>> {
        return this.answerOptionService.remove(id);
    }
}
