import { Module } from '@nestjs/common';
import { MaterialsService } from './materials.service';
import { MaterialsController } from './materials.controller';
import { Material } from './entities';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Lesson } from 'src/lessons/entities';
import { MaterialsListener } from './listeners/materials.listeners';
import { LessonsModule } from 'src/lessons/lessons.module';
import { CoursesModule } from 'src/courses/courses.module';
import { Student } from 'src/exports/entities';

@Module({
    imports: [
        HttpModule,
        AuthModule,
        LessonsModule,
        CoursesModule,
        CacheModule.register(),
        TypeOrmModule.forFeature([Material, Lesson, Student]),
    ],
    controllers: [MaterialsController],
    providers: [MaterialsService, MaterialsListener],
    exports: [MaterialsService],
})
export class MaterialsModule {}
