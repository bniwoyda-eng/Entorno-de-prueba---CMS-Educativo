import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MaterialCreatedEvent, MaterialUpdatedEvent, MaterialDeletedEvent } from '../events/materials.events';
import { LessonsService } from 'src/lessons/lessons.service';
import { CoursesService } from 'src/courses/courses.service';

@Injectable()
export class MaterialsListener {
    constructor(
        private readonly lessonsService: LessonsService,
        private readonly coursesService: CoursesService
    ) {}

    @OnEvent('material.created')
    async handleMaterialCreatedEvent(event: MaterialCreatedEvent) {
        await this.lessonsService.updateLessonDurationAndMaterialCount(event.materialId);
        await this.coursesService.updateCourseDuration(event.materialId);
    }

    @OnEvent('material.updated')
    async handleMaterialUpdatedEvent(event: MaterialUpdatedEvent) {
        await this.lessonsService.updateLessonDurationAndMaterialCount(event.materialId);
        await this.coursesService.updateCourseDuration(event.materialId);
    }

    @OnEvent('material.deleted')
    async handleMaterialDeletedEvent(event: MaterialDeletedEvent) {
        await this.lessonsService.updateLessonDurationAndMaterialCount(event.materialId, true);
        await this.coursesService.updateCourseDuration(event.materialId, true);
    }
}
