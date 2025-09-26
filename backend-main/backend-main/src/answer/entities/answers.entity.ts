import { Column, Entity, ManyToOne } from 'typeorm';
import { Question } from '../../question/entities/questions.entity';
import { AbstractEntityUUID } from 'src/common/entities';

@Entity()
export class Answer extends AbstractEntityUUID {
    @Column({ type: 'uuid', nullable: false })
    correctAnswerOptionId: string;

    @ManyToOne(() => Question, (question) => question.answers, { onDelete: 'CASCADE' })
    question: Question;
}
