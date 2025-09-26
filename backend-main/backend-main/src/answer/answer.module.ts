import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Answer } from './entities';
import { Question } from 'src/question/entities';

@Module({
    imports: [HttpModule, AuthModule, TypeOrmModule.forFeature([Question, Answer])],
    controllers: [AnswerController],
    providers: [AnswerService],
})
export class AnswerModule {}
