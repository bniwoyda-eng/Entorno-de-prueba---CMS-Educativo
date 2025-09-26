import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntityUUID } from 'src/common/entities';
import { Course, Student } from 'src/exports/entities';
import { BaseEnrollmentProgress } from './enrollment-progress.interface';

@Entity('student_enrollments')
export class StudentEnrollment extends AbstractEntityUUID implements BaseEnrollmentProgress {

    @ManyToOne(() => Student, (student) => student.studentEnrollments, { nullable: false })
    student: Student;

    @ManyToOne(() => Course, (course) => course.studentEnrollments, { nullable: false })
    course: Course;

    @Column({ type: 'float', default: 0 })
    totalCompleted: number;

    @Column({ type: 'float', default: 0 })
    progressPercentage: number;

    @Column({ type: 'timestamp', nullable: true })
    completedAt: Date;

}
