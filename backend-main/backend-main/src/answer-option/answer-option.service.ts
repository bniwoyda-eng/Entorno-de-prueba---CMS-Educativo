import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnswerOptions } from './entities/answer-options.entity';
import { Question } from '../question/entities/questions.entity';
import { AbstractResponse } from 'src/common/interfaces';
import { CreateAnswerOptionDto, UpdateAnswerOptionDto } from './dtos';

@Injectable()
export class AnswerOptionService {
    constructor(
        @InjectRepository(AnswerOptions)
        private readonly answerOptionRepository: Repository<AnswerOptions>,
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>
    ) {}

    async create(createAnswerOptionDto: CreateAnswerOptionDto): Promise<AbstractResponse<AnswerOptions>> {
        const { questionId } = createAnswerOptionDto;
        const question = await this.questionRepository.findOne({ where: { id: questionId } });
        if (!question) {
            throw new NotFoundException(`Question with ID ${questionId} not found`);
        }

        const answerOption = this.answerOptionRepository.create({
            ...createAnswerOptionDto,
            question,
        });
        await this.answerOptionRepository.save(answerOption);
        return {
            code: 201,
            result: 'success',
            payload: {
                data: answerOption,
            },
        };
    }

    async findAll(): Promise<AbstractResponse<AnswerOptions[]>> {
        const answerOptions = await this.answerOptionRepository.find({ relations: ['question'] });
        return {
            code: 200,
            result: 'success',
            payload: {
                data: answerOptions,
            },
        };
    }

    async findOne(id: string): Promise<AbstractResponse<AnswerOptions>> {
        const answerOption = await this.answerOptionRepository.findOne({ where: { id }, relations: ['question'] });
        if (!answerOption) {
            throw new NotFoundException(`AnswerOption with ID ${id} not found`);
        }
        return {
            code: 200,
            result: 'success',
            payload: {
                data: answerOption,
            },
        };
    }

    async update(id: string, updateAnswerOptionDto: UpdateAnswerOptionDto): Promise<AbstractResponse<AnswerOptions>> {
        const answerOption = await this.answerOptionRepository.preload({
            id,
            ...updateAnswerOptionDto,
        });
        if (!answerOption) {
            throw new NotFoundException(`AnswerOption with ID ${id} not found`);
        }
        await this.answerOptionRepository.save(answerOption);
        return {
            code: 200,
            result: 'success',
            payload: {
                data: answerOption,
            },
        };
    }

    async remove(id: string): Promise<AbstractResponse<void>> {
        const answerOption = await this.findOne(id);
        if (answerOption.code !== 200) {
            throw new NotFoundException(`AnswerOption with ID ${id} not found`);
        }
        await this.answerOptionRepository.softRemove(answerOption.payload.data);
        return {
            code: 204,
            result: 'success',
            payload: null,
        };
    }
}
