import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { PostCommentService } from './comments.service';
import { CreatePostCommentDto } from '../dto';
import { Auth, GetUser } from 'src/auth/decorators';
import { PaginationDto } from 'src/common';
import { ValidRoles } from 'src/auth';
import { User } from 'src/exports/entities';

@ApiBearerAuth()    // TODO: Agregar decoradores de autenticación y autorización
@ApiTags('posts')
@Controller('posts/:postId/comments')

export class PostCommentController {

    constructor(private readonly service: PostCommentService) { }

    @Post()
    @Auth(ValidRoles.educator)
    @ApiOperation({ summary: 'Create a new post comment' })
    @ApiBody({ type: CreatePostCommentDto })
    @ApiResponse({ status: 201, description: 'Post post comment created successfully' })
    create(@GetUser() user: User, @Param('postId', ParseUUIDPipe) postId: string, @Body() dto: CreatePostCommentDto) {
        return this.service.create(user, postId, dto);
    }

    @Get()
    @Auth(ValidRoles.educator)
    @ApiOperation({ summary: 'Get all comments by resource' })
    @ApiResponse({ status: 200, description: 'List of all comments' })
    findAll(@Param('postId', ParseUUIDPipe) postId: string, @Query() pagination: PaginationDto) {
        return this.service.findAllByPost(postId, pagination);
    }

    @Get(':commentId')
    @Auth(ValidRoles.educator)
    @ApiOperation({ summary: 'Get a resource comment by ID' })
    @ApiResponse({ status: 200, description: 'Post comment found' })
    @ApiResponse({ status: 404, description: 'Post comment not found' })
    findOne(@Param('postId', ParseUUIDPipe) postId: string, @Param('commentId', ParseUUIDPipe) commentId: string) {
        return this.service.findOne(postId, commentId);
    }

    @Delete(':commentId')
    @Auth(ValidRoles.educator)
    @ApiOperation({ summary: 'Delete a comment by ID' })
    @ApiResponse({ status: 200, description: 'Post comment deleted successfully' })
    @ApiResponse({ status: 404, description: 'Post comment not found' })
    remove(@GetUser('id') userId: string, @Param('postId', ParseUUIDPipe) postId: string, @Param('commentId', ParseUUIDPipe) commentId: string) {
        return this.service.remove(userId, postId, commentId);
    }


}
