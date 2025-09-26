import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth, GetUser, GetInstitutionId } from 'src/auth/decorators';
import { User } from 'src/auth/entities';
import { ValidRoles } from 'src/auth/interfaces';
import { AbstractPaginationQueryDto } from 'src/common/dtos';
import { AbstractResponse, AbstractPaginationResponse } from 'src/common/interfaces';
import { Student } from './entities/students.entity';
import { CreateStudentDto, UpdateStudentDto } from './dtos';

@ApiTags('Student')
@ApiBearerAuth()
@Controller('student')
export class StudentController {
    constructor(private readonly studentService: StudentService) {}

    @Post('student')
    @Auth(ValidRoles.institution)
    @ApiOperation({ summary: 'Create a new student' })
    @ApiResponse({
        status: 201,
        description: 'The student has been successfully created.',
        type: CreateStudentDto,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    createStudent(
        @GetUser() institutionEmployee: User,
        @GetInstitutionId() institutionId: string,
        @Body() createStudentDto: CreateStudentDto
    ): Promise<AbstractResponse<Student>> {
        return this.studentService.createStudent(institutionEmployee, institutionId, createStudentDto);
    }

    @Get('students')
    @Auth(ValidRoles.institution)
    @ApiOperation({ summary: 'Get all students by educational institution' })
    @ApiResponse({
        status: 200,
        description: 'List of all students in the given educational institution.',
        type: [CreateStudentDto],
    })
    async findAllStudentsByEducationalInstitution(
        @GetInstitutionId() institutionId: string,
        @Query() paginationQueryDto: AbstractPaginationQueryDto
    ): Promise<AbstractPaginationResponse<Student[]>> {
        return this.studentService.findAllStudentsByInstitution(institutionId, paginationQueryDto);
    }

    @Get('student/:id')
    @Auth(ValidRoles.institution, ValidRoles.student)
    @ApiOperation({ summary: 'Get a student by id' })
    @ApiResponse({
        status: 200,
        description: 'The student with the given ID.',
        type: CreateStudentDto,
    })
    findStudent(
        @GetInstitutionId() institutionId: string,
        @Param('id') studentId: string
    ): Promise<AbstractResponse<Student>> {
        return this.studentService.findOneStudent(institutionId, studentId);
    }

    @Patch('student/:id')
    @Auth(ValidRoles.institution)
    @ApiOperation({ summary: 'Update a student by id' })
    @ApiResponse({
        status: 200,
        description: 'The student has been successfully updated.',
        type: UpdateStudentDto,
    })
    updateStudent(
        @GetUser() institutionEmployee: User,
        @GetInstitutionId() institutionId: string,
        @Param('id') studentId: string,
        @Body() updateStudentDto: UpdateStudentDto
    ): Promise<AbstractResponse<Student>> {
        return this.studentService.updateStudent(institutionEmployee, institutionId, studentId, updateStudentDto);
    }

    @Delete('student/:id')
    @Auth(ValidRoles.institution)
    @ApiOperation({ summary: 'Delete a student by id' })
    @ApiResponse({ status: 204, description: 'The student has been successfully deleted.' })
    removeStudent(
        @GetUser() institutionEmployee: User,
        @GetInstitutionId() institutionId: string,
        @Param('id') studentId: string
    ): Promise<AbstractResponse<Student>> {
        return this.studentService.removeStudent(institutionEmployee, institutionId, studentId);
    }
}
