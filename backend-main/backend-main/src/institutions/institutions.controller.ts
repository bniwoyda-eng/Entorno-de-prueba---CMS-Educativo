import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InstitutionService } from './institutions.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AbstractResponse, AbstractPaginationResponse } from 'src/common/interfaces';
import { AbstractPaginationQueryDto } from 'src/common/dtos';
import { InstitutionEmployees, Institution } from './entities';
import { Auth, GetUser } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/auth/entities/user.entity';
import {
    InstitutionsCreateDto,
    InstitutionsUpdateDto,
    InstitutionEmployeesCreateDto,
    InstitutionEmployeesUpdateDto,
} from './dtos';

@ApiTags('EducationalInstitutions')
@ApiBearerAuth()
@Controller('educational-institutions')
export class InstitutionController {
    constructor(private readonly institutionService: InstitutionService) {}

    @Post()
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Create a new educational institution' })
    @ApiResponse({
        status: 201,
        description: 'Educational institution created',
        type: [InstitutionsCreateDto],
    })
    create(
        @GetUser() user: User,
        @Body() institutionsCreateDto: InstitutionsCreateDto
    ): Promise<AbstractResponse<Institution>> {
        return this.institutionService.createInstitution(user, institutionsCreateDto);
    }

    @Get()
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Get all educational institutions' })
    @ApiResponse({
        status: 200,
        description: 'List of all educational institutions.',
        type: [InstitutionsCreateDto],
    })
    findAllEducationalInstitutions(
        @Query() paginationQueryDto: AbstractPaginationQueryDto
    ): Promise<AbstractPaginationResponse<Institution[]>> {
        return this.institutionService.findAllInstitutions(paginationQueryDto);
    }

    @Get(':id')
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Get an educational institution by id' })
    @ApiResponse({
        status: 200,
        description: 'The educational institution with the given ID.',
        type: [InstitutionsCreateDto],
    })
    findOneEducationalInstitution(@Param('id') id: string): Promise<AbstractResponse<Institution>> {
        return this.institutionService.findOneInstitution(id);
    }

    @Patch(':id')
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Update an educational institution by id' })
    @ApiResponse({
        status: 200,
        description: 'The educational institution has been successfully updated.',
        type: InstitutionsUpdateDto,
    })
    updateEducationalInstitution(
        @GetUser() user: User,
        @Param('id') id: string,
        @Body() institutionsUpdateDto: InstitutionsUpdateDto
    ): Promise<AbstractResponse<Institution>> {
        return this.institutionService.updateInstitution(user, id, institutionsUpdateDto);
    }

    @Delete(':id')
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Delete an educational institution by id' })
    @ApiResponse({ status: 204, description: 'The educational institution has been successfully deleted.' })
    removeEducationalInstitution(@Param('id') id: string): Promise<AbstractResponse<Institution>> {
        return this.institutionService.removeInstitution(id);
    }

    // Employee routes
    @Post('employees')
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Create a new employee' })
    @ApiResponse({
        status: 201,
        description: 'The employee has been successfully created.',
        type: InstitutionEmployeesCreateDto,
    })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    createEmployee(
        @Body() institutionEmployeesCreateDto: InstitutionEmployeesCreateDto
    ): Promise<AbstractResponse<InstitutionEmployees>> {
        return this.institutionService.createInstitutionEmployee(institutionEmployeesCreateDto);
    }

    @Get(':educationalInstitutionId/employees')
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Get all employees by educational institution' })
    @ApiResponse({
        status: 200,
        description: 'List of all employees in the given educational institution.',
        type: [InstitutionEmployeesCreateDto],
    })
    async findAllEmployeesByEducationalInstitution(
        @Param('educationalInstitutionId') educationalInstitutionId: string,
        @Query() paginationQueryDto: AbstractPaginationQueryDto
    ): Promise<AbstractPaginationResponse<InstitutionEmployees[]>> {
        return this.institutionService.findAllEmployeesByInstitution(educationalInstitutionId, paginationQueryDto);
    }

    @Get('employees/:id')
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Get an employee by id' })
    @ApiResponse({
        status: 200,
        description: 'The employee with the given ID.',
        type: InstitutionEmployeesCreateDto,
    })
    findEmployee(@Param('id') id: string): Promise<AbstractResponse<InstitutionEmployees>> {
        return this.institutionService.findInstitutionEmployee(id);
    }

    @Patch('employees/:id')
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Update an employee by id' })
    @ApiResponse({
        status: 200,
        description: 'The employee has been successfully updated.',
        type: InstitutionEmployeesUpdateDto,
    })
    updateEmployee(
        @Param('id') id: string,
        @Body() institutionEmployeesUpdateDto: InstitutionEmployeesUpdateDto
    ): Promise<AbstractResponse<InstitutionEmployees>> {
        return this.institutionService.updateInstitutionEmployee(id, institutionEmployeesUpdateDto);
    }

    @Delete('employees/:id')
    @Auth(ValidRoles.admin)
    @ApiOperation({ summary: 'Delete an employee by id' })
    @ApiResponse({ status: 204, description: 'The employee has been successfully deleted.' })
    removeEmployee(@Param('id') id: string): Promise<AbstractResponse<InstitutionEmployees>> {
        return this.institutionService.removeInstitutionEmployee(id);
    }
}
