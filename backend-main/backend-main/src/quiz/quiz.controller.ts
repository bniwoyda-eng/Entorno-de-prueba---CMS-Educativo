import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { AbstractPaginationQueryDto } from 'src/common/dtos';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AbstractResponse, AbstractPaginationResponse } from 'src/common/interfaces';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities';
import { CheckQuizDto, CreateQuizDto, UpdateQuizDto, ValidateAnswerDto } from './dtos';
import { Quiz } from './entities';
import { Question } from 'src/question/entities';

@ApiTags('Quizzes')
@ApiBearerAuth()
@Controller('quizzes')
export class QuizController {
    constructor(private readonly quizService: QuizService) { }

    @Post(':quizId/check')
    @Auth(ValidRoles.student, ValidRoles.educator)
    @ApiOperation({ summary: 'Validate quiz answers' })
    @ApiResponse({ status: 200, description: 'Quiz validation result', })
    validateQuiz(@GetUser() user: User, @Param('quizId') quizId: string, @Body() dto: CheckQuizDto): Promise<any> {
        return this.quizService.validateQuiz(user, quizId, dto);
    }

    @Get('/material/:materialId')
    @Auth(ValidRoles.student, ValidRoles.educator)
    @ApiOperation({ summary: 'Get a quiz by material id for students' })
    @ApiResponse({ status: 200, description: 'The quiz with the given material ID for students.', type: CreateQuizDto })
    @ApiResponse({ status: 404, description: 'Quiz not found.' })
    findOneByMaterialId(@GetUser('id') userId: string, @Param('materialId') materialId: string): Promise<Quiz> {
        return this.quizService.findOneByMaterialId(userId, materialId);
    }
}
