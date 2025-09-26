import { Controller, Get } from '@nestjs/common';

import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { EnrollmentsService } from './enrollment.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { User } from 'src/auth/entities/user.entity';

@ApiBearerAuth()
@ApiTags('enrollments')
@Controller('enrollments')
export class EnrollmentsController {
    constructor(private readonly enrollmentsService: EnrollmentsService) { }

    @Get('me')
    @Auth(ValidRoles.educator, ValidRoles.student)
    @ApiOperation({ summary: 'Get all enrollments for the logged-in user' })
    getMyEnrollments(@GetUser() user: User): Promise<[]> {
        return this.enrollmentsService.getMyEnrollments(user);
    }

}
