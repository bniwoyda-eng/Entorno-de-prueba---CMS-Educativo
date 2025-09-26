import { Column, Entity, ManyToOne } from 'typeorm';
import { Question } from '../../question/entities';
import { AbstractEntityUUID } from 'src/common/entities';

@Entity()
export class AnswerOptions extends AbstractEntityUUID {
    @Column({ type: 'varchar', length: 255 })
    option: string;

    @ManyToOne(() => Question, (question) => question.answerOptions, { onDelete: 'CASCADE' })
    question: Question;
}
