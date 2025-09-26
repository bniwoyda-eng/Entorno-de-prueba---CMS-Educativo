import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/questions.entity';
import { CreateQuestionDto, UpdateQuestionDto } from './dtos';
import { Quiz } from '../quiz/entities/quiz.entity';
import { AbstractResponse } from 'src/common/interfaces';


@Injectable()
export class QuestionService {
    constructor(
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
        @InjectRepository(Quiz)
        private readonly quizRepository: Repository<Quiz>
    ) {}

    async create(createQuestionDto: CreateQuestionDto): Promise<AbstractResponse<Question>> {
        const { quizId } = createQuestionDto;
        const quiz = await this.quizRepository.findOne({ where: { id: quizId } });
        if (!quiz) {
            throw new NotFoundException(`Quiz with ID ${quizId} not found`);
        }

        const question = this.questionRepository.create({
            ...createQuestionDto,
            quiz,
        });
        await this.questionRepository.save(question);
        return {
            code: 201,
            result: 'success',
            payload: {
                data: question,
            },
        };
    }

    async findAll(): Promise<AbstractResponse<Question[]>> {
        const questions = await this.questionRepository.find({ relations: ['quiz', 'answers', 'answerOptions'] });
        return {
            code: 200,
            result: 'success',
            payload: {
                data: questions,
            },
        };
    }

    async findOne(id: string): Promise<AbstractResponse<Question>> {
        const question = await this.questionRepository.findOne({
            where: { id },
            relations: ['quiz', 'answers', 'answerOptions'],
        });
        if (!question) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }
        return {
            code: 200,
            result: 'success',
            payload: {
                data: question,
            },
        };
    }

    async update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<AbstractResponse<Question>> {
        const question = await this.questionRepository.preload({
            id,
            ...updateQuestionDto,
        });
        if (!question) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }
        await this.questionRepository.save(question);
        return {
            code: 200,
            result: 'success',
            payload: {
                data: question,
            },
        };
    }

    async remove(id: string): Promise<AbstractResponse<void>> {
        const question = await this.findOne(id);
        if (!question) {
            throw new NotFoundException(`Question with ID ${id} not found`);
        }
        await this.questionRepository.softRemove(question.payload.data);
        return {
            code: 204,
            result: 'success',
            payload: null,
        };
    }
}
