import { Check, Column, Entity, Index, ManyToOne } from "typeorm";
import { AbstractEntityUUID } from "src/common/entities";
import { Assessment } from "./index";

@Entity({ name: 'assessment_risk_segments' })
// @Index(['assessment', 'riskSegment'], { unique: true })
export class AssessmentRiskSegment extends AbstractEntityUUID {

    @ManyToOne(() => Assessment, (assessment) => assessment.riskSegments)
    assessment: Assessment;

    @Column()
    minScore: number;

    @Column()
    maxScore: number;

    @Column({ nullable: true, type: 'text' })
    recommendations: string;

}
