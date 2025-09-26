import { Module } from '@nestjs/common';
import { AnswerOptionService } from './answer-option.service';
import { AnswerOptionController } from './answer-option.controller';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Question } from 'src/question/entities';
import { AnswerOptions } from './entities';

@Module({
    imports: [HttpModule, AuthModule, CacheModule.register(), TypeOrmModule.forFeature([Question, AnswerOptions])],
    controllers: [AnswerOptionController],
    providers: [AnswerOptionService],
})
export class AnswerOptionModule {}
