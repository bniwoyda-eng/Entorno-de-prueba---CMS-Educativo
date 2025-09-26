import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dtos/create-lesson.dto';
import { UpdateLessonDto } from './dtos/update-lesson.dto';
import { AbstractPaginationQueryDto } from 'src/common/dtos';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AbstractResponse, AbstractPaginationResponse } from 'src/common/interfaces';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';
import { Lesson } from './entities/lessons.entity';
import { SearchLessonsDto } from './dtos';

@ApiTags('Lesson')
@ApiBearerAuth()
@Controller('lessons')
export class LessonsController {
    constructor(private readonly lessonsService: LessonsService) {}

    @Post()
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Create a new lesson' })
    @ApiResponse({
        status: 201,
        description: 'Lesson created',
        type: CreateLessonDto,
    })
    create(@GetUser() user: User, @Body() createLessonDto: CreateLessonDto): Promise<AbstractResponse<Lesson>> {
        return this.lessonsService.create(createLessonDto);
    }

    @Get('backoffice')
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Get all lessons' })
    @ApiResponse({
        status: 200,
        description: 'List of all lessons.',
        type: [CreateLessonDto],
    })
    findAll(@Query() searchLessonsDto: SearchLessonsDto): Promise<AbstractPaginationResponse<Lesson[]>> {
        return this.lessonsService.findAll(searchLessonsDto);
    }

    @Get('backoffice/:id')
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Get a lesson by id' })
    @ApiResponse({
        status: 200,
        description: 'The lesson with the given ID.',
        type: CreateLessonDto,
    })
    findOne(@Param('id') id: string): Promise<AbstractResponse<Lesson>> {
        return this.lessonsService.findOne(id);
    }

    @Patch(':id')
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Update a lesson by id' })
    @ApiResponse({
        status: 200,
        description: 'The lesson has been successfully updated.',
        type: UpdateLessonDto,
    })
    update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto): Promise<AbstractResponse<Lesson>> {
        return this.lessonsService.update(id, updateLessonDto);
    }

    @Delete(':id')
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Delete a lesson by id' })
    @ApiResponse({ status: 204, description: 'The lesson has been successfully deleted.' })
    remove(@Param('id') id: string): Promise<AbstractResponse<Lesson>> {
        return this.lessonsService.remove(id);
    }
}
