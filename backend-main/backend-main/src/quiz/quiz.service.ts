import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Not, Repository } from 'typeorm';
import { Quiz } from './entities/quiz.entity';
import { Question } from '../question/entities';
import { Answer } from '../answer/entities/answers.entity';
import { AbstractPaginationQueryDto } from 'src/common/dtos';
import { AbstractResponse, AbstractPaginationResponse } from 'src/common/interfaces';
import { CheckQuizDto, CreateQuizDto, UpdateQuizDto, ValidateAnswerDto } from './dtos';
import { Material } from 'src/materials/entities/materials.entity';
import { StudentProgress } from 'src/progress/entities';
import { User } from 'src/auth/entities';
import { Lesson } from 'src/lessons/entities';
import { MaterialType } from 'src/materials/enums';
import { Student } from 'src/exports/entities';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MaterialCompletedEvent } from 'src/progress/events';
import { ProgressService } from 'src/progress/progress.service';
import { UpdateProgressDto } from 'src/progress/dto';

@Injectable()
export class QuizService {
    constructor(
        private readonly eventEmitter: EventEmitter2,
        @InjectRepository(Quiz)
        private readonly quizRepository: Repository<Quiz>,
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
        @InjectRepository(Answer)
        private readonly answerRepository: Repository<Answer>,
        @InjectRepository(Material)
        private readonly materialsRepository: Repository<Material>,
        @InjectRepository(Lesson)
        private readonly lessonsRepository: Repository<Lesson>,
        @InjectRepository(Student)
        private readonly studentsRepository: Repository<Student>,

        private readonly progressService: ProgressService
    ) { }

    // MAB: Validar quiz (todas las preguntas) y devolver el progreso + puntuación
    async validateQuiz(user: User, quizId: string, dto: CheckQuizDto): Promise<any> {
        try {
            const { answers, materialId } = dto;

            const existingProgress = await this.progressService.getMaterialProgress(user, materialId);
            if (!existingProgress) throw new NotFoundException(`Progress with material ID ${materialId} not found for user ID ${user.id}`);
            // const { id: courseId } = existingProgress.material.lesson.course;

            // Obtenemos el quiz
            const quiz = await this.quizRepository.findOne({ where: { id: quizId }, relations: ['questions', 'questions.answers'] });
            if (!quiz || quiz.questions.length === 0) throw new NotFoundException(`Quiz with ID ${quizId} not found or has no questions`);

            // Validar respuestas
            let score = 0;
            for (const answer of answers) {
                const question = await this.questionRepository.findOne({
                    where: { id: answer.questionId, quiz: { id: quizId } },
                    relations: ['answers', 'answerOptions'],
                });
                if (!question) throw new NotFoundException(`Question with ID ${answer.questionId} not found in this quiz`);
                const correctAnswers = question.answers.filter((ans) => ans.correctAnswerOptionId);
                const selectedAnswers = answer.selectedOptionsIds.map((id) => question.answerOptions.find((opt) => opt.id === id));
                const correctOptionIds = correctAnswers.map((ans) => ans.correctAnswerOptionId).sort();
                const selectedOptionIds = selectedAnswers
                    .filter((opt): opt is typeof opt & { id: number } => !!opt)
                    .map((opt) => opt.id)
                    .sort();

                // Penalizar si seleccionó alguna opción incorrecta
                const hasIncorrect = selectedOptionIds.some((id) => !correctOptionIds.includes(id));

                if (!hasIncorrect && selectedOptionIds.length > 0) {
                    const partialScore = (selectedOptionIds.filter((id) => correctOptionIds.includes(id)).length / correctOptionIds.length) * (100 / quiz.questions.length);
                    score += partialScore;
                }
            }

            score = Math.min(100, parseFloat(score.toFixed(2)));

            // Actualizar el progreso del estudiante
            existingProgress.score = score;
            existingProgress.progressPercentage = 100;

            const updateDto: UpdateProgressDto = {
                score: existingProgress.score,
                lastPosition: existingProgress.lastPosition,
                finished: true,
            };
            await this.progressService.updateMaterialProgress(user, materialId, updateDto);

            // Emitir evento de progreso actualizado
            // this.eventEmitter.emit('person.material.completed', new MaterialCompletedEvent(studentId, courseId, 100));

            return existingProgress;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException(`Error validating quiz: ${error.message}`);
        }
    }

    // MAB: Obtener el quiz por el ID del material
    async findOneByMaterialId(userId: string, materialId: string): Promise<Quiz> {
        // const student = await this.studentsRepository.findOne({ where: { user: { id: userId } }, });
        // if (!student) throw new NotFoundException(`Student with user ID ${userId} not found`);

        const quiz = await this.quizRepository.findOne({
            where: { material: { id: materialId } },
            relations: ['questions', 'questions.answerOptions'],
            order: {
                questions: { sequence: 'ASC' }, // Ordena las preguntas por la propiedad 'sequence'
            },
        });

        if (!quiz) throw new NotFoundException(`Quiz with material ID ${materialId} not found`);
        return quiz;
    }


}
