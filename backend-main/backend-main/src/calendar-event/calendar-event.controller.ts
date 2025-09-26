import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateCalendarEventDto, UpdateCalendarEventDto, CalendarEventQueryDto } from './dto';
import { CalendarEventService } from './calendar-event.service';
import { CalendarEvent, User } from 'src/exports/entities';
import { Auth, GetUser, ValidRoles } from 'src/auth';
import { imageFileFilter } from 'src/utils';

@Controller('calendar-event')
export class CalendarEventController {
  constructor(private readonly calendarEventService: CalendarEventService) { }

  @Post()
  @Auth(ValidRoles.educator, ValidRoles.admin)
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: imageFileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  }))
  create(@GetUser() user: User, @UploadedFile() file: Express.Multer.File, @Body() dto: CreateCalendarEventDto) {
    console.log('Creating calendar event with file:', file?.originalname, file?.mimetype, file?.size);
    return this.calendarEventService.create(user, file, dto);
  }

  @Get()
  @Auth(ValidRoles.educator)
  @ApiOperation({ summary: 'Get all calendar events' })
  @ApiResponse({ status: 200, description: 'List of all calendar events.', type: [CalendarEvent] })
  findAll(@GetUser() user: User, @Query() query: CalendarEventQueryDto) {
    return this.calendarEventService.findAll(user, query);
  }

  @Get(':id')
  @Auth(ValidRoles.educator)
  @ApiOperation({ summary: 'Get a calendar event by ID' })
  @ApiResponse({ status: 200, description: 'The calendar event with the given ID.', type: CalendarEvent })
  @ApiResponse({ status: 404, description: 'CalendarEvent not found.' })
  findOne(@GetUser() user: User, @Param('id') id: string) {
    return this.calendarEventService.findOne(user, id);
  }

  @Patch(':id')
  @Auth(ValidRoles.educator)
  @UseInterceptors(FileInterceptor('image', {
    fileFilter: imageFileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  }))
  @ApiOperation({ summary: 'Update a calendar event by ID' })
  @ApiResponse({ status: 200, description: 'The updated calendar event.', type: CalendarEvent })
  @ApiResponse({ status: 404, description: 'CalendarEvent not found.' })
  update(@Param('id') id: string, @GetUser() user: User, @UploadedFile() file: Express.Multer.File, @Body() updateCalendarEventDto: UpdateCalendarEventDto) {
    return this.calendarEventService.update(id, user, file, updateCalendarEventDto);
  }

  @Delete(':id/image')
  @Auth(ValidRoles.educator)
  @ApiOperation({ summary: 'Delete the image of a calendar event by ID' })
  @ApiResponse({ status: 200, description: 'The image of the calendar event has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'CalendarEvent not found.' })
  removeImage(@Param('id') id: string, @GetUser() user: User) {
    return this.calendarEventService.removeImage(id, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.educator)
  @ApiOperation({ summary: 'Delete a calendar event by ID' })
  @ApiResponse({ status: 200, description: 'The calendar event has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'CalendarEvent not found.' })
  remove(@Param('id') id: string, @GetUser() user: User) {
    return this.calendarEventService.remove(id, user);
  }
}
