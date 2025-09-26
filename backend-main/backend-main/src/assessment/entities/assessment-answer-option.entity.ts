import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntityUUID } from "src/common/entities";
import { AssessmentQuestion } from "./index";

@Entity({ name: 'assessment_answer_options' })
export class AssessmentAnswerOption extends AbstractEntityUUID {

    @Column()
    answerText: string;

    @Column({ type: 'int', unsigned: true })
    score: number;

    @ManyToOne(() => AssessmentQuestion, (question) => question.answerOptions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_assessment_question' })
    question: AssessmentQuestion;

    @Column()
    id_assessment_question: string;

}
