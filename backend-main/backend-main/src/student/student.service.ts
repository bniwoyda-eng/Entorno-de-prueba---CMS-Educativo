import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from 'src/auth/dtos';
import { User } from 'src/auth/entities';
import { ValidRoles } from 'src/auth/interfaces';
import { AbstractPaginationQueryDto } from 'src/common/dtos';
import { AbstractResponse, AbstractPaginationResponse } from 'src/common/interfaces';
import { EmailService } from 'src/email/email.service';
import { Institution } from 'src/institutions/entities';
import { InstitutionService } from 'src/institutions/institutions.service';
import { Repository } from 'typeorm';
import { Student } from './entities/students.entity';
import { CreateStudentDto, UpdateStudentDto } from './dtos';
import { Course } from 'src/courses/entities';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class StudentService {
    private readonly logger = new Logger(InstitutionService.name);

    constructor(
        private readonly authService: AuthService,
        private readonly emailService: EmailService,

        @InjectRepository(Institution)
        private institutionsRepository: Repository<Institution>,
        @InjectRepository(Student)
        private studentsRepository: Repository<Student>,
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>
    ) {}

    // REHACER MÉTODOS


    async updateStudentTotalContentDuration(courseId: string): Promise<void> {
        // const enrollments = await this.enrollmentsRepository.find({
        //     where: { course: { id: courseId } },
        //     relations: ['student'],
        // });
        // for (const enrollment of enrollments) {
        //     const student = enrollment.student;
        //     const courses = await this.coursesRepository.find({
        //         where: { enrollments: { student: { id: student.id } } },
        //         relations: ['lessons', 'lessons.materials'],
        //     });
        //     student.total_content_duration = courses.reduce((sum, course) => sum + (course.totalDuration || 0), 0);
        //     await this.studentsRepository.save(student);
        // }
    }

    async createStudent(
        institutionEmployee: User,
        institutionId: string,
        createStudentDto: CreateStudentDto
    ): Promise<AbstractResponse<Student>> {
        if (institutionId !== createStudentDto.institutionId) {
            throw new BadRequestException(
                'The institution ID in the DTO does not match the institution ID of the employee.'
            );
        }

        const { email, fullName } = createStudentDto;

        const institution = await this.institutionsRepository.findOne({ where: { id: institutionId } });
        if (!institution) {
            throw new NotFoundException(`Institution with ID ${institutionId} not found`);
        }

        // Crear usuario para el estudiante
        const createUserDto: CreateUserDto = {
            email,
            password: this.generateRandomPassword(),
            fullName,
            tenantId: institutionId,
            roles: [ValidRoles.student],
        };

        let user: User;
        try {
            const { user: createdUser } = await this.authService.registerUser(createUserDto);
            user = createdUser;
        } catch (error) {
            this.logger.error(`Failed to create user for student: ${error.message}`, error.stack);
            throw error;
        }

        // Crear el estudiante
        const newStudent = this.studentsRepository.create({
            ...createStudentDto,
            institution,
            user,
        });

        const savedStudent = await this.studentsRepository.save(newStudent);

        // Enviar correo con la contraseña al estudiante
        await this.emailService.sendRegistrationEmail(createUserDto);

        return {
            code: savedStudent ? 200 : 500,
            result: savedStudent ? 'success' : 'error',
            payload: {
                data: savedStudent,
            },
        };
    }

    async findAllStudentsByInstitution(
        institutionId: string,
        paginationQueryDto: AbstractPaginationQueryDto
    ): Promise<AbstractPaginationResponse<Student[]>> {
        const { page, limit } = paginationQueryDto;
        const [result, total] = await this.studentsRepository.findAndCount({
            where: { institution: { id: institutionId } },
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

    async findOneStudent(institutionId: string, id: string): Promise<AbstractResponse<Student>> {
        const student = await this.studentsRepository.findOne({
            where: { id, institution: { id: institutionId } },
        });
        if (!student) {
            throw new NotFoundException(`Student with ID ${id} not found in institution with ID ${institutionId}`);
        }
        return {
            code: 200,
            result: 'success',
            payload: {
                data: student,
            },
        };
    }

    async updateStudent(
        institutionEmployee: User,
        institutionId: string,
        id: string,
        updateStudentDto: UpdateStudentDto
    ): Promise<AbstractResponse<Student>> {
        if (institutionId !== updateStudentDto.institutionId) {
            throw new BadRequestException(
                'The institution ID in the DTO does not match the institution ID of the employee.'
            );
        }

        const existingStudent = await this.studentsRepository.findOne({
            where: { id, institution: { id: institutionId } },
        });
        if (!existingStudent) {
            throw new NotFoundException(`Student with ID ${id} not found in institution with ID ${institutionId}`);
        }

        const institution = await this.institutionsRepository.findOne({
            where: { id: institutionId },
        });
        if (!institution) {
            throw new NotFoundException(`Institution with ID ${institutionId} not found`);
        }

        const updatedStudent = this.studentsRepository.merge(existingStudent, {
            ...updateStudentDto,
            institution,
        });

        const savedStudent = await this.studentsRepository.save(updatedStudent);
        return {
            code: 200,
            result: 'success',
            payload: {
                data: savedStudent,
            },
        };
    }

    async removeStudent(
        institutionEmployee: User,
        institutionId: string,
        id: string
    ): Promise<AbstractResponse<Student>> {
        const student = await this.studentsRepository.findOne({
            where: { id, institution: { id: institutionId } },
        });
        if (!student) {
            throw new NotFoundException(`Student with ID ${id} not found in institution with ID ${institutionId}`);
        }
        await this.studentsRepository.softRemove(student);
        return {
            code: 200,
            result: 'success',
            payload: {
                data: student,
            },
        };
    }

    private generateRandomPassword(): string {
        const passwordLength = 8;
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numericChars = '0123456789';
        const specialChars = '!@#$%&*()_+{}:<>?[];,./';
        const allChars = uppercaseChars + lowercaseChars + numericChars + specialChars;

        const getRandomChar = (characters: string) => characters.charAt(Math.floor(Math.random() * characters.length));

        let password = [
            getRandomChar(uppercaseChars),
            getRandomChar(lowercaseChars),
            getRandomChar(numericChars),
            getRandomChar(specialChars),
        ];

        while (password.length < passwordLength) {
            password.push(getRandomChar(allChars));
        }

        password = password.sort(() => Math.random() - 0.5);

        return password.join('');
    }
}
