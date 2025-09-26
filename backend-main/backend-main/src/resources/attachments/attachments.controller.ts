import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { CreateResourceAttachmentDto, UpdateResourceAttachmentDto } from '../dto';
import { AttachmentsService } from './attachments.service';
import { PaginationDto } from 'src/common';

@ApiBearerAuth()    // TODO: Agregar decoradores de autenticación y autorización
@ApiTags('resources')
@Controller('resources/:resourceId/attachments')

export class AttachmentsController {

  constructor(private readonly service: AttachmentsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new attachment' })
  @ApiBody({ type: CreateResourceAttachmentDto })
  @ApiResponse({ status: 201, description: 'Resource attachment created successfully' })
  create(@Param('resourceId', ParseUUIDPipe) resourceId: string, @Body() dto: CreateResourceAttachmentDto) {
    return this.service.create(resourceId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all resources attachments' })
  @ApiResponse({ status: 200, description: 'List of all resources attachments' })
  findAll(@Param('resourceId', ParseUUIDPipe) resourceId: string, @Query() dto: PaginationDto) {
    return this.service.findAll(resourceId, dto);
  }

  @Get(':attachmentId')
  @ApiOperation({ summary: 'Get a resource attachment by ID' })
  @ApiResponse({ status: 200, description: 'Resource attachment found' })
  @ApiResponse({ status: 404, description: 'Resource attachment not found' })
  findOne(@Param('resourceId', ParseUUIDPipe) resourceId: string, @Param('attachmentId', ParseUUIDPipe) attachmentId: string) {
    return this.service.findOne(resourceId, attachmentId);
  }

  @Patch(':attachmentId')
  @ApiOperation({ summary: 'Update a attachment by ID' })
  @ApiBody({ type: UpdateResourceAttachmentDto })
  @ApiResponse({ status: 200, description: 'Resource attachment updated successfully' })
  @ApiResponse({ status: 404, description: 'Resource attachment not found' })
  update(@Param('resourceId', ParseUUIDPipe) resourceId: string, @Param('attachmentId', ParseUUIDPipe) attachmentId: string, @Body() dto: UpdateResourceAttachmentDto) {
    return this.service.update(resourceId, attachmentId, dto);
  }

  @Delete(':attachmentId')
  @ApiOperation({ summary: 'Delete a attachment by ID' })
  @ApiResponse({ status: 200, description: 'Resource attachment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Resource attachment not found' })
  remove(@Param('resourceId', ParseUUIDPipe) resourceId: string, @Param('attachmentId', ParseUUIDPipe) attachmentId: string) {
    return this.service.remove(resourceId, attachmentId);
  }


}
