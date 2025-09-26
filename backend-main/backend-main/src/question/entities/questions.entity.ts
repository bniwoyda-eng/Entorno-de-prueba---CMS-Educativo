import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Answer } from '../../answer/entities/answers.entity';
import { Quiz } from '../../quiz/entities/quiz.entity';
import { AnswerOptions } from 'src/answer-option/entities';
import { AbstractEntityUUID } from 'src/common/entities';
import { QuestionType } from '../enums';

@Entity()
export class Question extends AbstractEntityUUID {
    @Column({ type: 'text' })
    text: string;

    @Column({ type: 'enum', enum: QuestionType, default: QuestionType.SINGLE })
    type: QuestionType;

    @Column({ type: 'int', nullable: false, default: 1 })
    sequence: number;

    @ManyToOne(() => Quiz, (quiz) => quiz.questions, { onDelete: 'CASCADE' })
    quiz: Quiz;

    @OneToMany(() => Answer, (answer) => answer.question, { cascade: true })
    answers: Answer[];

    @OneToMany(() => AnswerOptions, (answerOptions) => answerOptions.question, { cascade: true })
    answerOptions: AnswerOptions[];
}
