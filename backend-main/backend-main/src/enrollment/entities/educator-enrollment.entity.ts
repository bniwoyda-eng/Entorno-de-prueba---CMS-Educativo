import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntityUUID } from 'src/common/entities';
import { Course, Educator } from 'src/exports/entities';
import { BaseEnrollmentProgress } from './enrollment-progress.interface';

@Entity('educator_enrollments')
export class EducatorEnrollment extends AbstractEntityUUID implements BaseEnrollmentProgress {

    @ManyToOne(() => Educator, (educator) => educator.educatorEnrollments, { nullable: false })
    educator: Educator;

    @ManyToOne(() => Course, (course) => course.educatorEnrollments, { nullable: false })
    course: Course;

    @Column({ type: 'float', default: 0 })
    totalCompleted: number;

    @Column({ type: 'float', default: 0 })
    progressPercentage: number;

    @Column({ type: 'timestamp', nullable: true })
    completedAt: Date;

}
