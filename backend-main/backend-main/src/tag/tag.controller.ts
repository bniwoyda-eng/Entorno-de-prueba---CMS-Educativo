import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTagDto, UpdateTagDto } from './dto';
import { PaginationDto } from 'src/common';
import { Auth, ValidRoles } from 'src/auth';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';

@ApiTags('Tags')
@Controller('tags')
@ApiBearerAuth()
export class TagController {
  constructor(private readonly tagService: TagService) { }

  @Auth(ValidRoles.admin)
  @Post()
  @ApiOperation({ summary: 'Create a new tag' })
  @ApiQuery({ type: CreateTagDto })
  @ApiResponse({ status: 201, description: 'Tag created successfully', type: Tag })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Auth(ValidRoles.admin, ValidRoles.educator)
  @Get()
  @ApiOperation({ summary: 'Get all tags' })
  @ApiQuery({ type: PaginationDto })
  @ApiResponse({ status: 200, description: 'Tags retrieved successfully', type: [Tag] })
  findAll() {
    return this.tagService.findAll();
  }

  @Auth(ValidRoles.admin)
  @Get(':id')
  @ApiOperation({ summary: 'Get a tag by ID' })
  @ApiResponse({ status: 200, description: 'Tag retrieved successfully', type: Tag })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tagService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Update a tag by ID' })
  @ApiResponse({ status: 200, description: 'Tag updated successfully', type: Tag })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTagDto: UpdateTagDto) {
    return this.tagService.update(id, updateTagDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiOperation({ summary: 'Delete a tag by ID' })
  @ApiResponse({ status: 200, description: 'Tag deleted successfully' })
  @ApiResponse({ status: 404, description: 'Tag not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tagService.remove(id);
  }
}
