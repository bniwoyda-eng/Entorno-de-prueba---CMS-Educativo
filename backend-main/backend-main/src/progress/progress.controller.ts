import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Body, Param, Put } from '@nestjs/common';

import { Auth, GetUser, ValidRoles } from 'src/auth';
import { User } from 'src/exports/entities';
import { UpdateProgressDto } from './dto';
import { ProgressService } from './progress.service';

@ApiBearerAuth()
@ApiTags('progress')
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) { }

  @Get('global')
  @Auth(ValidRoles.educator, ValidRoles.student)
  @ApiOperation({ summary: 'Get global progress for the logged-in user (educator or student)' })
  getGlobalProgress(@GetUser() user: User) {
    return this.progressService.getGlobalProgress(user);
  }

  @Get('course/:courseId')
  @Auth(ValidRoles.educator, ValidRoles.student)
  @ApiOperation({ summary: 'Get course progress for the logged-in user (educator or student)' })
  getCourseProgress(@GetUser() user: User, @Param('courseId') courseId: string) {
    return this.progressService.getCourseProgress(user, courseId);
  }

  @Get('material/:materialId')
  @Auth(ValidRoles.educator, ValidRoles.student)
  @ApiOperation({ summary: 'Get a material progress for the logged-in user (educator or student)' })
  getMaterialProgress(@GetUser() user: User, @Param('materialId') materialId: string) {
    return this.progressService.getMaterialProgress(user, materialId);
  }

  @Put('material/:materialId')
  @Auth(ValidRoles.educator, ValidRoles.student)
  @ApiOperation({ summary: 'Update a material progress for the logged-in user (educator or student)' })
  updateMaterialProgress(@GetUser() user: User, @Param('materialId') materialId: string, @Body() updateProgressDto: UpdateProgressDto) {
    return this.progressService.updateMaterialProgress(user, materialId, updateProgressDto);
  }

}
