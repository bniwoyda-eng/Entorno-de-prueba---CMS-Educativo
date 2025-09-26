import { Course } from "src/courses/entities";
import { Educator, Student } from "src/exports/entities";

// interfaces/enrollment-progress.interface.ts
export interface BaseEnrollmentProgress {
    totalCompleted: number;
    progressPercentage: number;
    completedAt: Date;
    course: Course;

    educator?: Educator;
    student?: Student;
}
