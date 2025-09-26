import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntityUUID } from "src/common/entities";
import { AssessmentQuestionPivot, AssessmentAnswerOption } from "./index";

@Entity({ name: 'assessment_questions' })
export class AssessmentQuestion extends AbstractEntityUUID {

    @Column()
    questionText: string;

    @Column({ nullable: true })
    questionImage: string;

    @Column({ nullable: false, unsigned: true, default: 0 })
    maxScore: number;

    @OneToMany(() => AssessmentQuestionPivot, (pivot) => pivot.question)
    assessmentPivots: AssessmentQuestionPivot[];

    @OneToMany(() => AssessmentAnswerOption, (answerOption) => answerOption.question, { eager: true })
    answerOptions: AssessmentAnswerOption[];

}
