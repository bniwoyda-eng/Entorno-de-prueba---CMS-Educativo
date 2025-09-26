import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { AbstractEntityUUID } from "src/common/entities";
import { Assessment, AssessmentQuestion } from "./index";

@Entity('assessment_question_pivot')
export class AssessmentQuestionPivot extends AbstractEntityUUID {

    @Column()
    order: number;

    @ManyToOne(() => Assessment, (assessment) => assessment.questionPivots, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'id_assessment' })
    assessment: Assessment;

    @Column()
    id_assessment: string;

    @ManyToOne(() => AssessmentQuestion, (question) => question.assessmentPivots, { onDelete: 'CASCADE', eager: true })
    @JoinColumn({ name: 'id_assessment_question' })
    question: AssessmentQuestion;

    @Column()
    id_assessment_question: string;
}
