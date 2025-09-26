import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { AbstractEntityUUID } from "src/common/entities";
import { AssessmentCategory, AssessmentQuestionPivot, AssessmentRiskSegment } from "./index";
import { AssessmentGradient, TAssessmentGradient } from "../enums";

@Entity({ name: 'assessments' })
export class Assessment extends AbstractEntityUUID {

    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    banner: string;

    @Column({ type: 'integer', nullable: false, default: 0 })
    maxScore: number;

    @Column({ type: 'boolean', default: false })
    isActive: boolean;

    @Column({ type: 'enum', enum: AssessmentGradient, nullable: false, default: AssessmentGradient.NOT_DEFINED })
    gradient: TAssessmentGradient;

    @Column({ type: 'integer', nullable: false, default: 0 })
    attempts: number;

    @ManyToOne(() => AssessmentCategory, (assessmentCategory) => assessmentCategory.assessments, { eager: true })
    @JoinColumn({ name: 'id_assessment_category' })
    assessmentCategory: AssessmentCategory;

    @Column({ nullable: false })
    id_assessment_category: string;

    @OneToMany(() => AssessmentRiskSegment, (riskSegment) => riskSegment.assessment, { eager: true })
    riskSegments: AssessmentRiskSegment[];

    @OneToMany(() => AssessmentQuestionPivot, (questionPivot) => questionPivot.assessment)
    questionPivots: AssessmentQuestionPivot[];

}
