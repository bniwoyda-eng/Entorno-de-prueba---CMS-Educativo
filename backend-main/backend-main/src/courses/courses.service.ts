import { Injectable, NotFoundException, BadRequestException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { Course } from './entities/courses.entity';
import { AbstractResponse, AbstractPaginationResponse } from 'src/common/interfaces';
import { AbstractPaginationQueryDto } from 'src/common/dtos';
import { Material } from 'src/materials/entities';
import { Lesson } from 'src/lessons/entities';
import { Student } from 'src/exports/entities';
import { StudentService } from 'src/student/student.service';
import { StudentProgress } from 'src/progress/entities';
import { StudentEnrollment } from 'src/enrollment/entities/student-enrollment.entity';
import { ICourseStatistics, ICourseStatisticsForStudent } from './entities';

@Injectable()
export class CoursesService {
    constructor(
        private readonly studentService: StudentService,
        @InjectRepository(Course)
        private readonly coursesRepository: Repository<Course>,
        @InjectRepository(Student)
        private readonly studentsRepository: Repository<Student>,
        @InjectRepository(Lesson)
        private readonly lessonsRepository: Repository<Lesson>,
        @InjectRepository(Material)
        private readonly materialsRepository: Repository<Material>,
        @InjectRepository(StudentEnrollment)
        private readonly enrollmentsRepository: Repository<StudentEnrollment>,
        @InjectRepository(StudentProgress)
        private readonly progressRepository: Repository<StudentProgress>
    ) { }

    async updateCourseDuration(materialId: string, isDeleted: boolean = false): Promise<void> {
        const material = await this.materialsRepository.findOne({
            where: { id: materialId },
            relations: ['lesson', 'lesson.course'],
            withDeleted: true,
        });
        if (material && material.lesson && material.lesson.course) {
            const course = material.lesson.course;
            if (isDeleted) {
                // If the material has been deleted, subtract its duration
                course.totalDuration -= material.duration || 0;
            } else {
                // If the material has been created or updated, recalculate the total duration
                const lessons = await this.lessonsRepository.find({
                    where: { course: { id: course.id } },
                    relations: ['materials'],
                });
                course.totalDuration = lessons.reduce((sum, lesson) => sum + (lesson.totalDuration || 0), 0);
            }
            await this.coursesRepository.save(course);
            await this.studentService.updateStudentTotalContentDuration(course.id);
        }
    }

    async updateCourseLessonCount(courseId: string, isDeleted: boolean = false): Promise<void> {
        const course = await this.coursesRepository.findOne({
            where: { id: courseId },
            relations: ['lessons'],
        });
        if (course) {
            if (isDeleted) {
                // If a lesson has been deleted, subtract from the lesson counter
                course.lessonCount -= 1;
            } else {
                // If a lesson has been created, increment the lesson counter
                course.lessonCount += 1;
            }
            await this.coursesRepository.save(course);
        }
    }

    async create(createCourseDto: CreateCourseDto): Promise<AbstractResponse<Course>> {
        await this.validateCourseName(createCourseDto.title);

        const sequence = await this.getValidSequence(createCourseDto.sequence);

        const newCourse = this.coursesRepository.create({ ...createCourseDto, sequence });
        const savedCourse = await this.coursesRepository.save(newCourse);
        return {
            code: savedCourse ? 200 : 500,
            result: savedCourse ? 'success' : 'error',
            payload: {
                data: savedCourse,
            },
        };
    }

    async findAll(paginationQueryDto: AbstractPaginationQueryDto): Promise<AbstractPaginationResponse<Course[]>> {
        const { page, limit } = paginationQueryDto;
        const [result, total] = await this.coursesRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        });

        return {
            code: total === 0 ? 404 : 200,
            result: total === 0 ? 'not found' : 'success',
            payload: {
                data: result,
                total,
                page,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string): Promise<AbstractResponse<Course>> {
        const course = await this.coursesRepository.findOne({ where: { id } });
        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }
        return {
            code: 200,
            result: 'success',
            payload: {
                data: course,
            },
        };
    }

    async update(id: string, updateCourseDto: UpdateCourseDto): Promise<AbstractResponse<Course>> {
        const existingCourse = await this.coursesRepository.findOne({ where: { id } });
        if (!existingCourse) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }

        await this.validateCourseName(updateCourseDto.title, id);

        const sequence = await this.getValidSequence(updateCourseDto.sequence, existingCourse.sequence);

        const updatedCourse = this.coursesRepository.merge(existingCourse, { ...updateCourseDto, sequence });
        const savedCourse = await this.coursesRepository.save(updatedCourse);
        return {
            code: 200,
            result: 'success',
            payload: {
                data: savedCourse,
            },
        };
    }

    async remove(id: string): Promise<AbstractResponse<Course>> {
        const course = await this.coursesRepository.findOne({ where: { id } });
        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }
        await this.coursesRepository.softRemove(course);
        return {
            code: 200,
            result: 'success',
            payload: {
                data: course,
            },
        };
    }

    private async validateCourseName(title: string, id?: string): Promise<void> {
        const normalizedTitle = title.trim();
        const existingCourse = await this.coursesRepository.findOne({ where: { title: normalizedTitle } });
        if (existingCourse && existingCourse.id !== id) {
            throw new BadRequestException(`Course with title "${title}" already exists.`);
        }
    }

    private async getValidSequence(sequence?: number, currentSequence?: number): Promise<number> {
        if (sequence && sequence !== currentSequence) {
            const existingCourse = await this.coursesRepository.findOne({ where: { sequence } });
            if (existingCourse) {
                throw new BadRequestException(`Sequence ${sequence} is already in use.`);
            }
            return sequence;
        } else if (!sequence) {
            const maxSequence = await this.coursesRepository
                .createQueryBuilder('course')
                .select('MAX(course.sequence)', 'max')
                .getRawOne();
            return (maxSequence.max || 0) + 1;
        }
        return currentSequence;
    }


    // REHACER: Rehacer estos métodos en estrategias

    // MAB 19/03: Agrego un método para poder obtener el estado de un estudiante en los cursos
    // Actualmente en el frontend se hacen muchas llamadas a la API para obtener la información y se mappea en el frontend
    // Con este método se puede obtener toda la información en una sola llamada
    async getStudentCoursesProgress(userId: string) {
        // try {

        //     // Verificar si el usuario es un estudiante
        //     const student = await this.studentsRepository.findOne({ where: { user: { id: userId } }, select: ['id'] });
        //     if (!student) { throw new NotFoundException(`Student with user ID ${userId} not found`); }

        //     // Obtener los cursos en los que está inscripto el estudiante
        //     const enrollments = await this.enrollmentsRepository.createQueryBuilder('enrollment')
        //         .where('enrollment.student = :studentId', { studentId: student.id })
        //         .leftJoinAndSelect('enrollment.course', 'course')
        //         .getMany();
        //     if (!enrollments || enrollments.length === 0) {
        //         return []; // Si no hay inscripciones, retornar un array vacío
        //     }

        //     // Obtenemos la información completa de los cursos (con lecciones y materiales)
        //     const courseIds = enrollments.map((enrollment) => enrollment.course.id);
        //     const courses = await this.coursesRepository.createQueryBuilder('course')
        //         .leftJoinAndSelect('course.lessons', 'lesson')
        //         .leftJoinAndSelect('lesson.materials', 'material')

        //         .leftJoinAndSelect('material.studentProgress', 'studentProgress', 'studentProgress.student = :studentId', { studentId: student.id })

        //         // Obtenemos los atributos necesarios para calcular el progreso del estudiante
        //         .select([

        //             // Atributos del curso
        //             'course.id',
        //             'course.title',
        //             'course.description',
        //             'course.level',
        //             'course.imageUrl',
        //             'course.videoUrl',
        //             'course.totalDuration',
        //             'course.lessonCount',
        //             'course.sequence',

        //             // Atributos de la lección
        //             'lesson.id',
        //             'lesson.title',
        //             'lesson.description',
        //             'lesson.totalDuration',
        //             'lesson.materialCount',
        //             'lesson.sequence',

        //             // Atributos del material
        //             'material.id',
        //             'material.type',
        //             'material.title',
        //             'material.duration',
        //             'material.sequence',

        //             // Atributos del progreso del estudiante
        //             'studentProgress.id',
        //             'studentProgress.progress_percentage',

        //         ])

        //         // ordenar primero por curso, luego por lección y finalmente por material
        //         .orderBy('course.sequence', 'ASC')
        //         .addOrderBy('lesson.sequence', 'ASC')
        //         .addOrderBy('material.sequence', 'ASC')
        //         .where('course.id IN (:...courseIds)', { courseIds })
        //         .getMany() as any;

        //     // Calcular el progreso del estudiante en cada curso
        //     courses.forEach((course) => {

        //         const totalLessons = course.lessons.length;
        //         let completedLessons = 0;

        //         course.lessons.forEach((lesson) => {

        //             const totalMaterials = lesson.materials.length;
        //             let completedMaterials = 0;

        //             lesson.materials.forEach((material) => {
        //                 if (material.studentProgress.length > 0) {
        //                     material.studentProgress.forEach((progress) => {
        //                         if (progress.progress_percentage === 100) {
        //                             completedMaterials += 1;
        //                         }
        //                     });
        //                 }
        //             });

        //             lesson.completedMaterials = completedMaterials;
        //             lesson.progress_percentage = totalMaterials === 0 ? 0 : Math.round((completedMaterials / totalMaterials) * 100);

        //         });

        //         course.lessons.forEach((lesson) => {
        //             if (lesson.progress_percentage === 100) {
        //                 completedLessons += 1;
        //             }
        //         });

        //         course.completedLessons = completedLessons;
        //         course.progress_percentage = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
        //     });


        //     return courses;

        // } catch (error) {
        //     throw new InternalServerErrorException(error.message);
        // }
    }

    async getStudentCourseMain(courseId: string, userId: string) {

        // try {
        //     // 1. Verificar si el usuario está inscrito en el curso
        //     const enrollment = await this.enrollmentsRepository.findOne({ where: { course: { id: courseId }, student: { user: { id: userId } } } });
        //     if (!enrollment) throw new NotFoundException(`Enrollment not found for course ID ${courseId} and user ID ${userId}`);
        //     const { studentId } = enrollment;

        //     // 2. Obtener el curso completo con lecciones y materiales
        //     const course = await this.coursesRepository.createQueryBuilder('course')
        //         .where('course.id = :courseId', { courseId })
        //         .leftJoinAndSelect('course.lessons', 'lesson')
        //         .leftJoinAndSelect('lesson.materials', 'material')
        //         .leftJoinAndSelect('material.quiz', 'quiz')
        //         .leftJoinAndSelect('material.studentProgress', 'studentProgress', 'studentProgress.student = :studentId', { studentId })
        //         .select([
        //             'course.id', 'course.title', 'course.description', 'course.level', 'course.imageUrl', 'course.videoUrl', 'course.totalDuration', 'course.lessonCount', 'course.sequence', 'course.creation_date',
        //             'lesson.id', 'lesson.title', 'lesson.description', 'lesson.totalDuration', 'lesson.materialCount', 'lesson.sequence',
        //             'material.id', 'material.type', 'material.title', 'material.url', 'material.duration', 'material.sequence',
        //             'quiz.id', 'quiz.title', 'quiz.description',
        //             'studentProgress.id', 'studentProgress.progress_percentage',
        //         ])
        //         .orderBy('lesson.sequence', 'ASC')
        //         .addOrderBy('material.sequence', 'ASC')
        //         .getOne();
        //     if (!course) throw new NotFoundException(`Course with ID ${courseId} not found`);

        //     // 3. Obtener el progreso del estudiante en el curso
        //     const progress = await this.progressRepository.find({
        //         where: { student: { user: { id: userId } }, material: { lesson: { course: { id: courseId } } } },
        //     });

        //     // 4. Inicializar contadores
        //     let completedLessons = 0;
        //     let totalLessons = 0;
        //     let completedQuizzes = 0;
        //     let totalQuizzes = 0;
        //     let completedVideos = 0;
        //     let totalVideos = 0;

        //     // 5. Recorrer las lecciones y materiales para calcular el progreso
        //     for (const lesson of course.lessons) {
        //         totalLessons += 1;

        //         const materials = lesson.materials ?? [];

        //         for (const material of materials) {
        //             const isCompleted = progress.some((p) => p.materialId === material.id && p.progress_percentage === 100);

        //             if (material.type === 'quiz') {
        //                 totalQuizzes += 1;
        //                 if (isCompleted) completedQuizzes += 1;
        //             } else if (material.type === 'video') {
        //                 totalVideos += 1;
        //                 if (isCompleted) completedVideos += 1;
        //             }
        //         }

        //         // Marcar lección como completada si todos sus materiales están completados
        //         const allMaterialsCompleted = materials.every((material) =>
        //             progress.some((p) => p.materialId === material.id && p.progress_percentage === 100)
        //         );

        //         if (allMaterialsCompleted && materials.length > 0) {
        //             completedLessons += 1;
        //         }
        //     }

        //     // 6. Retornar el resumen de progreso y el curso
        //     return {
        //         completedQuizzes,
        //         totalQuizzes,
        //         completedVideos,
        //         totalVideos,
        //         completedLessons,
        //         totalLessons,
        //         course,
        //     };

        // } catch (error) {
        //     throw new InternalServerErrorException(error.message);
        // }
    }

    async getCourseList(): Promise<Course[]> {
        return this.coursesRepository.find();
    }


    // ------------------------ SERVICIO DE ESTADÍSTICA DE UN CURSO PARTICULAR (POR ID) ------------------------
    async getCourseStatistics(courseId: string): Promise<ICourseStatistics> {
        // 1. Obtener el curso con todas sus relaciones
        const course = await this.coursesRepository.findOne({
            where: { id: courseId },
            relations: ['lessons', 'lessons.materials']
        });

        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }

        // 2. Obtener todos los enrollments del curso
        const enrollments = await this.enrollmentsRepository.find({
            where: { course: { id: courseId } },
            relations: ['student']
        });

        // 3. Obtener todos los materiales del curso ordenados
        const allMaterials = [];
        course.lessons
            .sort((a, b) => a.sequence - b.sequence)
            .forEach(lesson => {
                lesson.materials
                    .sort((a, b) => a.sequence - b.sequence)
                    .forEach(material => {
                        allMaterials.push(material);
                    });
            });

        // 4. Obtener todo el progreso de estudiantes para este curso
        const materialIds = allMaterials.map(m => m.id);
        const allProgress = await this.progressRepository.find({
            where: { material: { id: In(materialIds) } },
            relations: ['student', 'material']
        });

        // 5. Calcular estadísticas básicas
        const totalStudentsEnrolled = enrollments.length;
        const studentsWithProgress = new Set(allProgress.map(p => p.student.id)).size;
        const studentsCompleted = enrollments.filter(e => e.progressPercentage === 100).length;
        const totalMaterials = allMaterials.length;

        // 6. Calcular porcentaje promedio de completación
        const avgCompletionPercentage = enrollments.length > 0
            ? enrollments.reduce((sum, e) => sum + e.progressPercentage, 0) / enrollments.length
            : 0;

        // 7. Materiales más completados
        const materialCompletionCount = {};
        allProgress
            .filter(p => p.progressPercentage === 100)
            .forEach(p => {
                const materialId = p.material.id;
                materialCompletionCount[materialId] = (materialCompletionCount[materialId] || 0) + 1;
            });

        const mostCompletedMaterial = allMaterials.reduce((max, material) => {
            const count = materialCompletionCount[material.id] || 0;
            return count > (materialCompletionCount[max?.id] || 0) ? material : max;
        }, null);

        // 8. Distribución de progreso
        const progressDistribution = {
            '0-25%': enrollments.filter(e => e.progressPercentage >= 0 && e.progressPercentage <= 25).length,
            '26-50%': enrollments.filter(e => e.progressPercentage > 25 && e.progressPercentage <= 50).length,
            '51-75%': enrollments.filter(e => e.progressPercentage > 50 && e.progressPercentage <= 75).length,
            '76-100%': enrollments.filter(e => e.progressPercentage > 75 && e.progressPercentage <= 100).length,
        };

        // 9. Performance en quizzes
        const quizProgress = allProgress.filter(p =>
            allMaterials.find(m => m.id === p.material.id)?.type === 'quiz' && p.score !== null
        );

        const avgQuizScore = quizProgress.length > 0
            ? quizProgress.reduce((sum, p) => sum + p.score, 0) / quizProgress.length
            : 0;

        const bestQuizMaterial = allMaterials
            .filter(m => m.type === 'quiz')
            .reduce((best, material) => {
                const scores = quizProgress.filter(p => p.material.id === material.id).map(p => p.score);
                const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
                const bestAvg = best ? quizProgress.filter(p => p.material.id === best.id).map(p => p.score).reduce((a, b) => a + b, 0) / quizProgress.filter(p => p.material.id === best.id).length : 0;
                return avgScore > bestAvg ? material : best;
            }, null);

        const worstQuizMaterial = allMaterials
            .filter(m => m.type === 'quiz')
            .reduce((worst, material) => {
                const scores = quizProgress.filter(p => p.material.id === material.id).map(p => p.score);
                const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 100;
                const worstAvg = worst ? quizProgress.filter(p => p.material.id === worst.id).map(p => p.score).reduce((a, b) => a + b, 0) / quizProgress.filter(p => p.material.id === worst.id).length : 100;
                return avgScore < worstAvg ? material : worst;
            }, null);

        // 10. Progreso por tipo de material
        const videoCompletions = allProgress.filter(p =>
            allMaterials.find(m => m.id === p.material.id)?.type === 'video' && p.progressPercentage === 100
        ).length;

        const quizCompletions = allProgress.filter(p =>
            allMaterials.find(m => m.id === p.material.id)?.type === 'quiz' && p.progressPercentage === 100
        ).length;

        const totalVideos = allMaterials.filter(m => m.type === 'video').length;
        const totalQuizzes = allMaterials.filter(m => m.type === 'quiz').length;

        // 11. Tasa de completación del curso
        const courseCompletionRate = totalStudentsEnrolled > 0
            ? (studentsCompleted / totalStudentsEnrolled) * 100
            : 0;

        // 12. Material promedio completado por estudiante
        const avgMaterialsPerStudent = enrollments.length > 0
            ? enrollments.reduce((sum, e) => sum + e.totalCompleted, 0) / enrollments.length
            : 0;

        return {
            // Información del curso
            course: {
                id: course.id,
                title: course.title,
                description: course.description,
                totalDuration: course.totalDuration,
                lessonCount: course.lessonCount,
                totalMaterials: totalMaterials,
                totalVideos: totalVideos,
                totalQuizzes: totalQuizzes
            },

            // Estadísticas generales
            statistics: {
                totalStudentsEnrolled,
                studentsWithProgress,
                studentsCompleted,
                avgCompletionPercentage: Math.round(avgCompletionPercentage * 100) / 100,
                courseCompletionRate: Math.round(courseCompletionRate * 100) / 100,
                avgMaterialsPerStudent: Math.round(avgMaterialsPerStudent * 100) / 100,
            },

            // Distribución de progreso
            progressDistribution,

            // Performance en quizzes
            quizPerformance: {
                avgQuizScore: Math.round(avgQuizScore * 100) / 100,
                bestQuizMaterial: bestQuizMaterial ? {
                    id: bestQuizMaterial.id,
                    title: bestQuizMaterial.title,
                    sequence: bestQuizMaterial.sequence
                } : null,
                worstQuizMaterial: worstQuizMaterial ? {
                    id: worstQuizMaterial.id,
                    title: worstQuizMaterial.title,
                    sequence: worstQuizMaterial.sequence
                } : null,
                totalQuizCompletions: quizCompletions,
                totalQuizzes: totalQuizzes
            },

            // Progreso por tipo de material
            materialProgress: {
                videoCompletions,
                totalVideos,
                quizCompletions,
                totalQuizzes,
                videoCompletionRate: totalVideos > 0 ? Math.round((videoCompletions / totalVideos) * 100) / 100 : 0,
                quizCompletionRate: totalQuizzes > 0 ? Math.round((quizCompletions / totalQuizzes) * 100) / 100 : 0
            },

            // Material más completado
            mostCompletedMaterial: mostCompletedMaterial ? {
                id: mostCompletedMaterial.id,
                title: mostCompletedMaterial.title,
                type: mostCompletedMaterial.type,
                sequence: mostCompletedMaterial.sequence,
                completions: materialCompletionCount[mostCompletedMaterial.id] || 0
            } : null
        };
    }

    async getCourseStatisticsForStudent(courseId: string, studentId: string): Promise<ICourseStatisticsForStudent> {
        // 1. Obtener el curso con todas sus relaciones
        const course = await this.coursesRepository.findOne({
            where: { id: courseId },
            relations: ['lessons', 'lessons.materials']
        });

        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }

        // 2. Verificar que el usuario es un estudiante y está inscrito en el curso
        const student = await this.studentsRepository.findOne({
            where: { id: studentId },
            relations: ['user']
        });

        if (!student) {
            throw new NotFoundException(`Student with ID ${studentId} not found`);
        }

        const enrollment = await this.enrollmentsRepository.findOne({
            where: { course: { id: courseId }, student: { id: student.id } }
        });

        if (!enrollment) {
            throw new NotFoundException(`Student is not enrolled in course ${courseId}`);
        }

        // 3. Obtener todos los materiales del curso ordenados
        const allMaterials = [];
        course.lessons
            .sort((a, b) => a.sequence - b.sequence)
            .forEach(lesson => {
                lesson.materials
                    .sort((a, b) => a.sequence - b.sequence)
                    .forEach(material => {
                        allMaterials.push({
                            ...material,
                            lessonTitle: lesson.title,
                            lessonSequence: lesson.sequence
                        });
                    });
            });

        // 4. Obtener el progreso del estudiante para todos los materiales del curso
        const materialIds = allMaterials.map(m => m.id);
        const studentProgress = await this.progressRepository.find({
            where: {
                student: { id: student.id },
                material: { id: In(materialIds) }
            },
            relations: ['material']
        });

        // 5. Calcular estadísticas básicas del estudiante
        const totalMaterials = allMaterials.length;
        const completedMaterials = studentProgress.filter(p => p.progressPercentage === 100).length;
        const materialsWithProgress = studentProgress.filter(p => p.progressPercentage > 0).length;

        // Progreso general del estudiante
        const overallProgress = enrollment.progressPercentage || 0;
        const completedLessons = course.lessons.filter(lesson => {
            const lessonMaterials = lesson.materials;
            return lessonMaterials.every(material =>
                studentProgress.some(p => p.material.id === material.id && p.progressPercentage === 100)
            ) && lessonMaterials.length > 0;
        }).length;

        // 6. Separar por tipo de material
        const videoMaterials = allMaterials.filter(m => m.type === 'video');
        const quizMaterials = allMaterials.filter(m => m.type === 'quiz');

        const completedVideos = studentProgress.filter(p =>
            videoMaterials.some(v => v.id === p.material.id) && p.progressPercentage === 100
        ).length;

        const completedQuizzes = studentProgress.filter(p =>
            quizMaterials.some(q => q.id === p.material.id) && p.progressPercentage === 100
        ).length;

        // 7. Rendimiento en quizzes del estudiante
        const quizProgress = studentProgress.filter(p =>
            quizMaterials.some(q => q.id === p.material.id) && p.score !== null
        );

        const avgQuizScore = quizProgress.length > 0
            ? quizProgress.reduce((sum, p) => sum + (p.score || 0), 0) / quizProgress.length
            : 0;

        const bestQuizScore = quizProgress.length > 0
            ? Math.max(...quizProgress.map(p => p.score || 0))
            : 0;

        const worstQuizScore = quizProgress.length > 0
            ? Math.min(...quizProgress.map(p => p.score || 0))
            : 0;

        // 8. Tiempo estimado restante
        const remainingMaterials = totalMaterials - completedMaterials;
        const avgMaterialDuration = allMaterials.length > 0
            ? allMaterials.reduce((sum, m) => sum + (m.duration || 0), 0) / allMaterials.length
            : 0;
        const estimatedTimeRemaining = remainingMaterials * avgMaterialDuration;

        // 9. Progreso por lección
        const lessonsProgress = course.lessons
            .sort((a, b) => a.sequence - b.sequence)
            .map(lesson => {
                const lessonMaterialsCount = lesson.materials.length;
                const lessonCompletedCount = lesson.materials.filter(material =>
                    studentProgress.some(p => p.material.id === material.id && p.progressPercentage === 100)
                ).length;

                return {
                    id: lesson.id,
                    title: lesson.title,
                    sequence: lesson.sequence,
                    totalMaterials: lessonMaterialsCount,
                    completedMaterials: lessonCompletedCount,
                    progressPercentage: lessonMaterialsCount > 0
                        ? Math.round((lessonCompletedCount / lessonMaterialsCount) * 100)
                        : 0,
                    isCompleted: lessonCompletedCount === lessonMaterialsCount && lessonMaterialsCount > 0
                };
            });

        // 10. Materiales recientes (últimos 5 completados)
        const recentCompletedMaterials = studentProgress
            .filter(p => p.progressPercentage === 100)
            .sort((a, b) => new Date(b.update_date).getTime() - new Date(a.update_date).getTime())
            .slice(0, 5)
            .map(p => {
                const material = allMaterials.find(m => m.id === p.material.id);
                return {
                    id: material?.id,
                    title: material?.title,
                    type: material?.type,
                    lessonTitle: material?.lessonTitle,
                    completedAt: p.update_date
                };
            });

        // 11. Siguiente material recomendado
        const nextMaterial = allMaterials.find(material =>
            !studentProgress.some(p => p.material.id === material.id && p.progressPercentage === 100)
        );

        return {
            // Información del curso
            course: {
                id: course.id,
                title: course.title,
                description: course.description,
                totalDuration: course.totalDuration,
                lessonCount: course.lessonCount,
                totalMaterials: totalMaterials,
                totalVideos: videoMaterials.length,
                totalQuizzes: quizMaterials.length
            },

            // Información del estudiante
            student: {
                id: student.id,
                name: student.fullName || student.user.fullName,
                email: student.email || student.user.email,
                enrollmentDate: enrollment.creation_date
            },

            // Progreso general
            progress: {
                overallProgress: Math.round(overallProgress * 100) / 100,
                completedMaterials,
                totalMaterials,
                materialsWithProgress,
                completedLessons,
                totalLessons: course.lessonCount,
                completionRate: totalMaterials > 0 ? Math.round((completedMaterials / totalMaterials) * 100 * 100) / 100 : 0
            },

            // Progreso por tipo de material
            materialProgress: {
                videos: {
                    completed: completedVideos,
                    total: videoMaterials.length,
                    completionRate: videoMaterials.length > 0 ? Math.round((completedVideos / videoMaterials.length) * 100 * 100) / 100 : 0
                },
                quizzes: {
                    completed: completedQuizzes,
                    total: quizMaterials.length,
                    completionRate: quizMaterials.length > 0 ? Math.round((completedQuizzes / quizMaterials.length) * 100 * 100) / 100 : 0
                }
            },

            // Rendimiento en quizzes
            quizPerformance: {
                avgScore: Math.round(avgQuizScore * 100) / 100,
                bestScore: bestQuizScore,
                worstScore: worstQuizScore,
                totalAttempted: quizProgress.length,
                totalQuizzes: quizMaterials.length
            },

            // Tiempo estimado
            timeEstimation: {
                estimatedTimeRemaining: Math.round(estimatedTimeRemaining),
                avgMaterialDuration: Math.round(avgMaterialDuration),
                remainingMaterials
            },

            // Progreso por lección
            lessonsProgress,

            // Actividad reciente
            recentActivity: {
                recentCompletedMaterials,
                nextRecommendedMaterial: nextMaterial ? {
                    id: nextMaterial.id,
                    title: nextMaterial.title,
                    type: nextMaterial.type,
                    lessonTitle: nextMaterial.lessonTitle,
                    lessonSequence: nextMaterial.lessonSequence,
                    duration: nextMaterial.duration
                } : null
            }
        };
    }

    async getCourseEnrolledStudents(courseId: string, sortBy: 'name' | 'progress-asc' | 'progress-desc' = 'name'): Promise<Student[]> {
        const students = await this.studentsRepository.find({
            where: {
                studentEnrollments: {
                    course: { id: courseId }
                }
            },
            relations: { studentEnrollments: true },
            order: sortBy === 'name' ? {
                fullName: 'ASC'
            } : undefined
        });

        // If sorting by progress, we need to sort manually after getting the data
        if (sortBy === 'progress-desc' || sortBy === 'progress-asc') {
            students.sort((a, b) => {
                const aProgress = a.studentEnrollments[0]?.progressPercentage ?? 0;
                const bProgress = b.studentEnrollments[0]?.progressPercentage ?? 0;

                if (sortBy === 'progress-desc') {
                    return bProgress - aProgress; // Descending order (highest first)
                } else {
                    return aProgress - bProgress; // Ascending order (lowest first)
                }
            });
        }

        // Add progress percentage to each student for frontend use
        const studentsWithProgress = students.map(student => {
            const enrollment = student.studentEnrollments[0];
            return {
                ...student,
                progressPercentage: enrollment?.progressPercentage ?? 0
            };
        });

        return studentsWithProgress;
    }
}
