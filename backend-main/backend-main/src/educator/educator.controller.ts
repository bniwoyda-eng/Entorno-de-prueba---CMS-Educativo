import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Auth, GetUser, ValidRoles } from 'src/auth';
import { PaginationDto } from 'src/common';

import { CreateEducatorDto, UpdateEducatorDto } from './dto';
import { Educator } from './entities/educator.entity';
import { EducatorService } from './educator.service';
import { User } from 'src/exports/entities';

@ApiBearerAuth()
@ApiTags('educators')
@Controller('educators')
export class EducatorController {
  constructor(private readonly educatorService: EducatorService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new educator' })
  @ApiResponse({ status: 201, description: 'The educator has been successfully created.', type: Educator })
  create(@Body() dto: CreateEducatorDto) {
    return this.educatorService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all educators.' })
  @ApiResponse({ status: 200, description: 'List of all educators.', type: [Educator] })
  findAll(@Query() dto: PaginationDto) {
    return this.educatorService.findAll(dto);
  }

  @Get('suggested')
  @ApiOperation({ summary: 'Get suggested educators for a user' })
  @ApiResponse({ status: 200, description: 'List of suggested educators.', type: [Educator] })
  @Auth(ValidRoles.educator)
  suggestedEducators(@GetUser() user: User, @Query('count') count: number = 5) {
    return this.educatorService.suggestedEducators(user, count);
  }

  @Get('colleagues')
  @ApiOperation({ summary: 'Get colleagues educators for a user' })
  @ApiResponse({ status: 200, description: 'List of colleagues educators.', type: [Educator] })
  @Auth(ValidRoles.educator)
  getColleagues(@GetUser() user: User) {
    return this.educatorService.getColleagues(user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a educator by ID' })
  @ApiResponse({ status: 200, description: 'The educator with the given ID.', type: Educator })
  @ApiResponse({ status: 404, description: 'Educator not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.educatorService.findOne(id);
  }


  @Patch(':id')
  @ApiOperation({ summary: 'Update a educator by ID' })
  @ApiResponse({ status: 200, description: 'The educator has been successfully updated.', type: Educator })
  @ApiResponse({ status: 404, description: 'Educator not found.' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateEducatorDto) {
    return this.educatorService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a educator by ID' })
  @ApiResponse({ status: 200, description: 'The educator has been successfully deleted.', type: Educator })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.educatorService.remove(id);
  }

}
