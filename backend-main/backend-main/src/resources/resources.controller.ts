import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { CreateResourceDto, ResourceFilterDto, UpdateResourceDto, UpdateResourceStatusDto } from './dto';
import { ResourcesService } from './resources.service';
import { ResourceType } from './types';

@ApiBearerAuth()    // TODO: Agregar decoradores de autenticación y autorización
@ApiTags('resources')
@Controller('resources')
export class ResourcesController {

  constructor(private readonly service: ResourcesService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new resource' })
  @ApiBody({ type: CreateResourceDto })
  @ApiResponse({ status: 201, description: 'Resource created successfully' })
  create(@Body() dto: CreateResourceDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all resources' })
  @ApiResponse({ status: 200, description: 'List of all resources' })
  findAll(@Query() dto: ResourceFilterDto) {
    return this.service.findAll(dto);
  }

  @Get('grouped-by-type')
  @ApiOperation({ summary: 'Get resources grouped by type' })
  @ApiResponse({ status: 200, description: 'Resources grouped by type' })
  findGroupedByType() {
    return this.service.findGroupedByType();
  }

  @Get(':resourceId')
  @ApiOperation({ summary: 'Get a resource by ID' })
  @ApiResponse({ status: 200, description: 'Resource found' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  findOne(@Param('resourceId', ParseUUIDPipe) resourceId: string) {
    return this.service.findOne(resourceId);
  }

  @Get('/:resourceType/:resourceId/attachments')
  @ApiOperation({ summary: 'Get a resource by ID with attachments' })
  @ApiResponse({ status: 200, description: 'Resource found' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  findOneByResource(@Param('resourceType') resourceType: ResourceType, @Param('resourceId', ParseUUIDPipe) resourceId: string) {
    return this.service.findOneWithAttachments(resourceId, resourceType);
  }

  @Get(':resourceId/complete')
  @ApiOperation({ summary: 'Get a resource by ID with attachments and relations' })
  @ApiResponse({ status: 200, description: 'Resource found' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  findOneComplete(@Param('resourceId', ParseUUIDPipe) resourceId: string) {
    return this.service.findOneComplete(resourceId);
  }

  @Patch(':resourceId')
  @ApiOperation({ summary: 'Update a resource by ID' })
  @ApiBody({ type: UpdateResourceDto })
  @ApiResponse({ status: 200, description: 'Resource updated successfully' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  update(@Param('resourceId', ParseUUIDPipe) resourceId: string, @Body() dto: UpdateResourceDto) {
    return this.service.update(resourceId, dto);
  }

  @Patch(':resourceId/update-status')
  @ApiOperation({ summary: 'Update a resource status by ID' })
  @ApiBody({ type: UpdateResourceStatusDto })
  @ApiResponse({ status: 200, description: 'Resource status updated successfully' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  updateStatus(@Param('resourceId', ParseUUIDPipe) resourceId: string, @Body() dto: UpdateResourceStatusDto) {
    return this.service.updateStatus(resourceId, dto);
  }

  @Delete(':resourceId')
  @ApiOperation({ summary: 'Delete a resource by ID' })
  @ApiResponse({ status: 200, description: 'Resource deleted successfully' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  remove(@Param('resourceId', ParseUUIDPipe) resourceId: string) {
    return this.service.remove(resourceId);
  }

}