import { Module } from '@nestjs/common';
import { CalendarEventService } from './calendar-event.service';
import { CalendarEventController } from './calendar-event.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarEvent, CalendarEventTag } from './entities';
import { Tag } from 'src/tag/tag.entity';
import { S3Module } from 'src/s3/s3.module';
import { EducatorModule } from 'src/educator/educator.module';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      CalendarEvent,
      CalendarEventTag,
      Tag,
    ]),
    S3Module,
    EducatorModule,
  ],
  controllers: [CalendarEventController],
  providers: [CalendarEventService],
})
export class CalendarEventModule { }
