import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Answer } from './entities/answers.entity';
import { CreateAnswerDto, UpdateAnswerDto } from './dtos';
import { Question } from '../question/entities/questions.entity';
import { AbstractResponse } from 'src/common/interfaces';

@Injectable()
export class AnswerService {
    constructor(
        @InjectRepository(Answer)
        private readonly answerRepository: Repository<Answer>,
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>
    ) {}

    async create(createAnswerDto: CreateAnswerDto): Promise<AbstractResponse<Answer[]>> {
        const { questionId, correctAnswerOptionIds } = createAnswerDto;

        const question = await this.questionRepository
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.answerOptions', 'answerOptions')
            .where('question.id = :questionId', { questionId })
            .andWhere('answerOptions.id IN (:...correctAnswerOptionIds)', { correctAnswerOptionIds })
            .getOne();

        if (!question) {
            throw new NotFoundException(
                `Question with ID ${questionId} or one of the AnswerOptions with IDs ${correctAnswerOptionIds.join(', ')} not found`
            );
        }

        const existingAnswers = await this.answerRepository.find({
            where: { question: { id: questionId }, correctAnswerOptionId: In(correctAnswerOptionIds) },
        });

        if (existingAnswers.length > 0) {
            throw new ConflictException(
                `An answer for Question ID ${questionId} with one of the AnswerOption IDs ${correctAnswerOptionIds.join(', ')} already exists`
            );
        }

        const answers = correctAnswerOptionIds.map((correctAnswerOptionId) =>
            this.answerRepository.create({
                question,
                correctAnswerOptionId,
            })
        );

        await this.answerRepository.save(answers);
        return {
            code: 201,
            result: 'success',
            payload: {
                data: answers,
            },
        };
    }

    async findAll(): Promise<AbstractResponse<Answer[]>> {
        const answers = await this.answerRepository.find({ relations: ['question'] });
        return {
            code: 200,
            result: 'success',
            payload: {
                data: answers,
            },
        };
    }

    async findOne(id: string): Promise<AbstractResponse<Answer>> {
        const answer = await this.answerRepository.findOne({ where: { id }, relations: ['question'] });
        if (!answer) {
            throw new NotFoundException(`Answer with ID ${id} not found`);
        }
        return {
            code: 200,
            result: 'success',
            payload: {
                data: answer,
            },
        };
    }

    async update(id: string, updateAnswerDto: UpdateAnswerDto): Promise<AbstractResponse<Answer[]>> {
        const { questionId, correctAnswerOptionIds } = updateAnswerDto;

        const question = await this.questionRepository
            .createQueryBuilder('question')
            .leftJoinAndSelect('question.answerOptions', 'answerOptions')
            .where('question.id = :questionId', { questionId })
            .andWhere('answerOptions.id IN (:...correctAnswerOptionIds)', { correctAnswerOptionIds })
            .getOne();

        if (!question) {
            throw new NotFoundException(
                `Question with ID ${questionId} or one of the AnswerOptions with IDs ${correctAnswerOptionIds.join(', ')} not found`
            );
        }

        await this.answerRepository.delete({ question: { id: questionId } });

        const answers = correctAnswerOptionIds.map((correctAnswerOptionId) =>
            this.answerRepository.create({
                question,
                correctAnswerOptionId,
            })
        );

        await this.answerRepository.save(answers);
        return {
            code: 200,
            result: 'success',
            payload: {
                data: answers,
            },
        };
    }

    async remove(id: string): Promise<AbstractResponse<void>> {
        const answer = await this.findOne(id);
        if (!answer) {
            throw new NotFoundException(`Answer with ID ${id} not found`);
        }
        await this.answerRepository.softRemove(answer.payload.data);
        return {
            code: 204,
            result: 'success',
            payload: null,
        };
    }
}
