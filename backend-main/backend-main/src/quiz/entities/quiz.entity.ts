import { Column, Entity, OneToMany, ManyToOne } from 'typeorm';
import { AbstractEntityUUID } from 'src/common/entities';
import { Question } from '../../question/entities/questions.entity';
import { Material } from 'src/materials/entities';

@Entity()
export class Quiz extends AbstractEntityUUID {
    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @OneToMany(() => Question, (question) => question.quiz, { cascade: true })
    questions: Question[];

    @ManyToOne(() => Material, (material) => material.quiz, { nullable: false })
    material: Material;
}
