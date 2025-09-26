import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dtos/create-course.dto';
import { UpdateCourseDto } from './dtos/update-course.dto';
import { AbstractPaginationQueryDto } from 'src/common/dtos';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AbstractResponse, AbstractPaginationResponse } from 'src/common/interfaces';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';
import { Course } from './entities/courses.entity';

@ApiTags('Course')
@ApiBearerAuth()
@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) { }

    @Post()
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Create a new course' })
    @ApiResponse({
        status: 201,
        description: 'Course created',
        type: CreateCourseDto,
    })
    create(@GetUser() user: User, @Body() createCourseDto: CreateCourseDto): Promise<AbstractResponse<Course>> {
        return this.coursesService.create(createCourseDto);
    }

    @Get('backoffice')
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Get all courses' })
    @ApiResponse({
        status: 200,
        description: 'List of all courses.',
        type: [CreateCourseDto],
    })
    findAll(@Query() paginationQueryDto: AbstractPaginationQueryDto): Promise<AbstractPaginationResponse<Course[]>> {
        return this.coursesService.findAll(paginationQueryDto);
    }

    @Get('backoffice/:id')
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Get a course by id' })
    @ApiResponse({
        status: 200,
        description: 'The course with the given ID.',
        type: CreateCourseDto,
    })
    findOne(@Param('id') id: string): Promise<AbstractResponse<Course>> {
        return this.coursesService.findOne(id);
    }

    @Patch(':id')
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Update a course by id' })
    @ApiResponse({
        status: 200,
        description: 'The course has been successfully updated.',
        type: UpdateCourseDto,
    })
    update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto): Promise<AbstractResponse<Course>> {
        return this.coursesService.update(id, updateCourseDto);
    }

    @Delete(':id')
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Delete a course by id' })
    @ApiResponse({ status: 204, description: 'The course has been successfully deleted.' })
    remove(@Param('id') id: string): Promise<AbstractResponse<Course>> {
        return this.coursesService.remove(id);
    }

    @Get('student-progress')
    @Auth(ValidRoles.student)
    @ApiOperation({ summary: 'Get all courses with progress data for the logged-in student' })
    @ApiResponse({
        status: 200,
        description: 'List of all courses with progress data for the logged-in student.',
        type: [Course],
    })
    getStudentCoursesProgress(@GetUser() user: User): Promise<any> {
        return this.coursesService.getStudentCoursesProgress(user.id);
    }

    @Get(':id/student-main')
    @Auth(ValidRoles.student)
    getStudentCourseMain(@Param('id', ParseUUIDPipe) courseId: string, @GetUser('id') userId: string) {
        return this.coursesService.getStudentCourseMain(courseId, userId);
    }

    @Get('list')
    @Auth(ValidRoles.educator)
    getCourseList() {
        return this.coursesService.getCourseList();
    }

    @Get(':id/statistics')
    @Auth(ValidRoles.educator)
    getCourseStatistics(@Param('id', ParseUUIDPipe) courseId: string) {
        return this.coursesService.getCourseStatistics(courseId);
    }

    @Get(':id/statistics-for-student/:studentId')
    @Auth(ValidRoles.educator)
    getCourseStatisticsForStudent(@Param('id', ParseUUIDPipe) courseId: string, @Param('studentId', ParseUUIDPipe) studentId: string) {
        return this.coursesService.getCourseStatisticsForStudent(courseId, studentId);
    }

    @Get(':id/enrolled-students')
    @Auth(ValidRoles.educator)
    getCourseEnrolledStudents(
        @Param('id', ParseUUIDPipe) courseId: string,
        @Query('sortBy') sortBy: 'name' | 'progress-asc' | 'progress-desc' = 'name'
    ) {
        return this.coursesService.getCourseEnrolledStudents(courseId, sortBy);
    }
}
