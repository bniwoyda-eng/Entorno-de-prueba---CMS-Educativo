import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFiles, Query, ParseUUIDPipe } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Auth, GetUser, ValidRoles } from 'src/auth';
import { CreatePostDto, PostsQueryDto } from './dto';
import { PostService } from './post.service';
import { User } from 'src/exports/entities';
import { imageFileFilter } from 'src/utils';

@ApiBearerAuth()
@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post()
  @Auth(ValidRoles.educator)
  @UseInterceptors(FilesInterceptor('images', 4, {
    fileFilter: imageFileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
  }))
  create(@GetUser() user: User, @UploadedFiles() files: Express.Multer.File[], @Body() dto: CreatePostDto) {
    return this.postService.create(user, files, dto);
  }

  @Get()
  @Auth(ValidRoles.educator)
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({ status: 200, description: 'List of all posts.', type: [Post] })
  findAll(@GetUser() user: User, @Query() dto: PostsQueryDto) {
    return this.postService.findAll(user, dto);
  }

  @Get('suggested')
  @Auth(ValidRoles.educator)
  @ApiOperation({ summary: 'Get suggested educators for a user' })
  @ApiResponse({ status: 200, description: 'List of suggested educators.', type: [Post] })
  suggestedEducators(@GetUser() user: User, @Query('count') count: number = 5) {
    return this.postService.suggestedPosts(user, count);
  }

  @Get(':id')
  @Auth(ValidRoles.educator)
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiResponse({ status: 200, description: 'The post with the given ID.', type: Post })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  findOne(@GetUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.postService.findOne(user, id);
  }

  @Delete(':id')
  @Auth(ValidRoles.educator)
  @ApiOperation({ summary: 'Delete a post by ID' })
  @ApiResponse({ status: 200, description: 'The post has been successfully deleted.', type: Post })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  remove(@GetUser() user: User, @Param('id', ParseUUIDPipe) id: string) {
    return this.postService.remove(user, id);
  }

  @Get('author/:authorId')
  @Auth(ValidRoles.educator)
  @ApiOperation({ summary: 'Get author profile by ID' })
  @ApiResponse({ status: 200, description: 'The author profile with the given ID.', type: User })
  @ApiResponse({ status: 404, description: 'Author not found.' })
  getAuthorProfile(@GetUser() user: User, @Param('authorId', ParseUUIDPipe) authorId: string) {
    return this.postService.getAuthorProfile(user, authorId);
  }
}
