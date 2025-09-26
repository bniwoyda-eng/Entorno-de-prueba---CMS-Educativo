import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntityUUID, StudentProgress, EducatorProgress, Lesson } from 'src/exports/entities';
import { Quiz } from 'src/quiz/entities/quiz.entity';
import { MaterialType } from '../enums';

@Entity('materials')
export class Material extends AbstractEntityUUID {
    @Column({ enum: MaterialType, type: 'enum', nullable: false })
    type: MaterialType;

    @Column({ type: 'varchar', nullable: false })
    title: string;

    @Column({ type: 'varchar', nullable: true })
    url: string;

    @Column({ type: 'float', nullable: true })
    duration: number;

    @Column({ type: 'float', nullable: true })
    size: number;

    @Column({ type: 'int', nullable: false })
    sequence: number;

    @ManyToOne(() => Lesson, (lessonEntity) => lessonEntity.materials, { nullable: false })
    lesson: Lesson;

    @OneToMany(() => Quiz, (quiz) => quiz.material)
    quiz: Quiz[];

    @OneToMany(() => StudentProgress, (studentProgress) => studentProgress.material)
    studentProgress: StudentProgress[];

    @OneToMany(() => EducatorProgress, (educatorProgress) => educatorProgress.material)
    educatorProgress: EducatorProgress[];
}
