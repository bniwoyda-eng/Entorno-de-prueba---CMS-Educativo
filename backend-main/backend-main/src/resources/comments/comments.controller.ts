import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateResourceCommentDto } from '../dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationDto } from 'src/common';

@ApiBearerAuth()    // TODO: Agregar decoradores de autenticación y autorización
@ApiTags('resources')
@Controller('resources/:resourceId/comments')

export class CommentsController {

    constructor(private readonly service: CommentsService) { }

    @Auth()
    @Post()
    @ApiOperation({ summary: 'Create a new comment comment' })
    @ApiBody({ type: CreateResourceCommentDto })
    @ApiResponse({ status: 201, description: 'Resource comment comment created successfully' })
    create(@GetUser('id') userId: string, @Param('resourceId', ParseUUIDPipe) resourceId: string, @Body() dto: CreateResourceCommentDto) {
        return this.service.create(userId, resourceId, dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all comments by resource' })
    @ApiResponse({ status: 200, description: 'List of all comments' })
    findAll(@Param('resourceId', ParseUUIDPipe) resourceId: string, @Query() pagination: PaginationDto) {
        return this.service.findAllByResource(resourceId, pagination);
    }

    @Get(':commentId')
    @ApiOperation({ summary: 'Get a resource comment by ID' })
    @ApiResponse({ status: 200, description: 'Resource comment found' })
    @ApiResponse({ status: 404, description: 'Resource comment not found' })
    findOne(@Param('resourceId', ParseUUIDPipe) resourceId: string, @Param('commentId', ParseUUIDPipe) commentId: string) {
        return this.service.findOne(resourceId, commentId);
    }

    @Auth()
    @Delete(':commentId')
    @ApiOperation({ summary: 'Delete a comment by ID' })
    @ApiResponse({ status: 200, description: 'Resource comment deleted successfully' })
    @ApiResponse({ status: 404, description: 'Resource comment not found' })
    remove(@GetUser('id') userId: string, @Param('resourceId', ParseUUIDPipe) resourceId: string, @Param('commentId', ParseUUIDPipe) commentId: string) {
        return this.service.remove(userId, resourceId, commentId);
    }


}
