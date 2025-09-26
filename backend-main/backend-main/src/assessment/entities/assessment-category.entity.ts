import { Column, Entity, OneToMany } from "typeorm";
import { AbstractEntityUUID } from "src/common/entities";
import { Assessment } from "./index";

@Entity({ name: 'assessment_categories' })
export class AssessmentCategory extends AbstractEntityUUID {

    @Column({ unique: true, length: 100 })
    name: string;

    @OneToMany(() => Assessment, (assessment) => assessment.assessmentCategory)
    assessments: Assessment[];

}
