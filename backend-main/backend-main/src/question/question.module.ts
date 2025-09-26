import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Quiz } from 'src/quiz/entities';
import { Question } from './entities';

@Module({
    imports: [HttpModule, AuthModule, CacheModule.register(), TypeOrmModule.forFeature([Quiz, Question])],
    controllers: [QuestionController],
    providers: [QuestionService],
})
export class QuestionModule {}
