import { ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    InstitutionsCreateDto,
    InstitutionsUpdateDto,
    InstitutionEmployeesCreateDto,
    InstitutionEmployeesUpdateDto,
} from './dtos';
import { AbstractPaginationQueryDto } from 'src/common/dtos';
import { AbstractPaginationResponse, AbstractResponse } from 'src/common/interfaces';
import { CreateUserDto } from 'src/auth/dtos';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from '../email/email.service';
import { User } from 'src/auth/entities/user.entity';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { InstitutionEmployees, Institution } from './entities';

@Injectable()
export class InstitutionService {
    private readonly logger = new Logger(InstitutionService.name);

    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private readonly authService: AuthService,
        private readonly emailService: EmailService,

        @InjectRepository(Institution)
        private institutionsRepository: Repository<Institution>,
        @InjectRepository(InstitutionEmployees)
        private institutionEmployeesRepository: Repository<InstitutionEmployees>
    ) {}

    async createInstitution(
        user: User,
        institutionsCreateDto: InstitutionsCreateDto
    ): Promise<AbstractResponse<Institution>> {
        try {
            const existingInstitution = await this.institutionsRepository
                .createQueryBuilder('institution')
                .where('LOWER(institution.fiscalName) = LOWER(:fiscalName)', {
                    fiscalName: institutionsCreateDto.fiscalName.trim(),
                })
                .getOne();

            if (existingInstitution) {
                throw new ConflictException('Educational institution with this fiscal name already exists');
            }

            const newInstitution = this.institutionsRepository.create(institutionsCreateDto);
            newInstitution.createdBy = user.id;

            const savedInstitution = await this.institutionsRepository.save(newInstitution);
            const response: AbstractResponse<Institution> = {
                code: savedInstitution ? 200 : 404,
                result: savedInstitution ? 'success' : 'not found',
                payload: {
                    data: savedInstitution,
                },
            };
            return response;
        } catch (error) {
            this.logger.error(`Failed to create educational institution: ${error.message}`, error.stack);
            throw new NotFoundException('Failed to create educational institution');
        }
    }

    async findAllInstitutions(
        paginationQueryDto: AbstractPaginationQueryDto
    ): Promise<AbstractPaginationResponse<Institution[]>> {
        const { page, limit } = paginationQueryDto;
        try {
            const [result, total] = await this.institutionsRepository.findAndCount({
                skip: (page - 1) * limit,
                take: limit,
            });

            const response: AbstractPaginationResponse<Institution[]> = {
                code: total === 0 ? 404 : 200,
                result: total === 0 ? 'not found' : 'success',
                payload: {
                    data: result,
                    total,
                    page,
                    totalPages: Math.ceil(total / limit),
                },
            };

            return response;
        } catch (error) {
            this.logger.error(`Failed to find all educational institutions: ${error.message}`, error.stack);
            throw new NotFoundException('Failed to find all educational institutions');
        }
    }

    async findOneInstitution(id: string): Promise<AbstractResponse<Institution>> {
        try {
            const institution = await this.institutionsRepository.findOne({
                where: { id, is_deleted: null },
            });
            const response: AbstractResponse<Institution> = {
                code: institution ? 200 : 404,
                result: institution ? 'success' : 'not found',
                payload: {
                    data: institution,
                },
            };

            return response;
        } catch (error) {
            this.logger.error(`Failed to find educational institution with ID ${id}: ${error.message}`, error.stack);
            throw new NotFoundException(`Failed to find active educational institution with ID ${id}`);
        }
    }

    async updateInstitution(
        user: User,
        id: string,
        institutionsUpdateDto: InstitutionsUpdateDto
    ): Promise<AbstractResponse<Institution>> {
        try {
            const institution = await this.institutionsRepository.findOne({
                where: { id },
            });
            if (!institution) {
                throw new NotFoundException(`Educational institution with ID ${id} not found`);
            }

            // Preserve the original createdBy value
            const originalCreatedBy = institution.createdBy;
            institution.updatedBy = user.id;
            const editedinstitution = Object.assign(institution, institutionsUpdateDto);
            // Reassign the original createdBy value
            editedinstitution.createdBy = originalCreatedBy;

            await this.institutionsRepository.save(editedinstitution);

            const response: AbstractResponse<Institution> = {
                code: editedinstitution ? 200 : 500,
                result: editedinstitution ? 'success' : 'Educational institution not edited',
                payload: {
                    data: editedinstitution,
                },
            };

            return response;
        } catch (error) {
            this.logger.error(`Failed to update educational institution with ID ${id}: ${error.message}`, error.stack);
            throw new NotFoundException(`Failed to update educational institution with ID ${id}`);
        }
    }

    async removeInstitution(id: string): Promise<AbstractResponse<Institution>> {
        try {
            const institution = await this.institutionsRepository.findOne({ where: { id } });
            if (!institution) {
                throw new NotFoundException(`Educational institution with ID ${id} not found`);
            }
            await this.institutionsRepository.softRemove(institution);

            const response: AbstractResponse<Institution> = {
                code: 200,
                result: 'success',
                payload: {
                    data: institution,
                },
            };

            return response;
        } catch (error) {
            this.logger.error(`Failed to remove educational institution with ID ${id}: ${error.message}`, error.stack);
            throw new NotFoundException(`Failed to remove educational institution with ID ${id}`);
        }
    }

    async createInstitutionEmployee(
        institutionEmployeesCreateDto: InstitutionEmployeesCreateDto
    ): Promise<AbstractResponse<InstitutionEmployees>> {
        const { institutionId } = institutionEmployeesCreateDto;
        let educationalInstitution: Institution;
        try {
            educationalInstitution = await this.institutionsRepository.findOne({
                where: { id: institutionId },
            });
            if (!educationalInstitution) {
                return {
                    code: 404,
                    result: 'Educational institution not found',
                    payload: {
                        data: null,
                    },
                };
            }
        } catch (error) {}

        // Step 1: Create the employee
        let savedInstitutionEmployee: InstitutionEmployees;
        try {
            const institutionEmployee = this.institutionEmployeesRepository.create({
                ...institutionEmployeesCreateDto,
                institution: educationalInstitution,
                tenantId: institutionId,
            });

            savedInstitutionEmployee = await this.institutionEmployeesRepository.save(institutionEmployee);

            if (!savedInstitutionEmployee) {
                this.logger.error(
                    `Failed to create educational institution employee ${institutionEmployee}`,
                    institutionEmployee
                );
                throw new Error('Failed to create educational institution employee');
            }
        } catch (error) {
            this.logger.error(`Failed to create educational institution employee: ${error.message}`, error.stack);
            throw error;
        }

        // Step 2: Create a user for the employee
        const createUserDto: CreateUserDto = {
            email: institutionEmployeesCreateDto.email,
            password: this.generateRandomPassword(),
            fullName: institutionEmployeesCreateDto.fullName,
            tenantId: institutionId,
            employeeId: savedInstitutionEmployee.id,
        };
        let user: User;
        try {
            const { user: createdUser } = await this.authService.registerUser(createUserDto);
            user = createdUser;
        } catch (error) {
            this.logger.error(
                `Failed to create user for educational institution employee: ${error.message}`,
                error.stack
            );
            throw error;
        }

        // Step 3: Update the employee with the user reference
        // try {
        //     savedInstitutionEmployee.user = user;
        //     await this.institutionEmployeesRepository.save(savedInstitutionEmployee);
        // } catch (error) {
        //     this.logger.error(
        //         `Failed to update educational institution employee with user: ${error.message}`,
        //         error.stack
        //     );
        //     throw error;
        // }

        // Step 4: Send the password to the employee
        await this.emailService.sendRegistrationEmail(createUserDto);

        const response: AbstractResponse<InstitutionEmployees> = {
            code: savedInstitutionEmployee ? 200 : 500,
            result: savedInstitutionEmployee ? 'success' : 'Failed to create educational institution employee',
            payload: {
                data: savedInstitutionEmployee,
            },
        };

        return response;
    }

    async findInstitutionEmployee(id: string): Promise<AbstractResponse<InstitutionEmployees>> {
        try {
            const institutionEmployee = await this.institutionEmployeesRepository.findOne({
                where: { id },
                relations: ['educationalInstitution'],
            });
            const response: AbstractResponse<InstitutionEmployees> = {
                code: institutionEmployee ? 200 : 404,
                result: institutionEmployee ? 'success' : 'not found',
                payload: {
                    data: institutionEmployee,
                },
            };

            return response;
        } catch (error) {
            this.logger.error(
                `Failed to find educational institution employee with ID ${id}: ${error.message}`,
                error.stack
            );
            throw new NotFoundException(`Failed to find active educational institution employee with ID ${id}`);
        }
    }

    async findAllEmployeesByInstitution(
        institutionId: string,
        paginationQueryDto: AbstractPaginationQueryDto
    ): Promise<AbstractPaginationResponse<InstitutionEmployees[]>> {
        const { page, limit } = paginationQueryDto;
        try {
            const [result, total] = await this.institutionEmployeesRepository.findAndCount({
                where: { institution: { id: institutionId } },
                relations: ['institution'],
                skip: (page - 1) * limit,
                take: limit,
            });

            const response: AbstractPaginationResponse<InstitutionEmployees[]> = {
                code: total === 0 ? 404 : 200,
                result: total === 0 ? 'not found' : 'success',
                payload: {
                    data: result,
                    total,
                    page,
                    totalPages: Math.ceil(total / limit),
                },
            };

            return response;
        } catch (error) {
            this.logger.error(
                `Failed to find employees for educational institution with ID ${institutionId}: ${error.message}`,
                error.stack
            );
            throw new NotFoundException(
                `Failed to find active employees for educational institution with ID ${institutionId}`
            );
        }
    }

    async removeInstitutionEmployee(id: string): Promise<AbstractResponse<InstitutionEmployees>> {
        try {
            const institutionEmployee = await this.institutionEmployeesRepository.findOne({ where: { id } });
            if (!institutionEmployee) {
                throw new NotFoundException(`Active educational institution employee with ID ${id} not found`);
            }
            await this.institutionEmployeesRepository.softRemove(institutionEmployee);

            const response: AbstractResponse<InstitutionEmployees> = {
                code: 200,
                result: 'success',
                payload: {
                    data: institutionEmployee,
                },
            };

            return response;
        } catch (error) {
            this.logger.error(
                `Failed to remove educational institution employee with ID ${id}: ${error.message}`,
                error.stack
            );
            throw new NotFoundException(`Failed to remove educational institution employee with ID ${id}`);
        }
    }

    async updateInstitutionEmployee(
        id: string,
        institutionEmployeesUpdateDto: InstitutionEmployeesUpdateDto
    ): Promise<AbstractResponse<InstitutionEmployees>> {
        try {
            const institutionEmployee = await this.institutionEmployeesRepository.findOne({
                where: { id },
            });
            if (!institutionEmployee) {
                throw new NotFoundException(`Active educational institution employee with ID ${id} not found`);
            }
            const editedInstitutionEmployee = Object.assign(institutionEmployee, institutionEmployeesUpdateDto);
            const savedInstitutionEmployee = await this.institutionEmployeesRepository.save(editedInstitutionEmployee);

            const response: AbstractResponse<InstitutionEmployees> = {
                code: savedInstitutionEmployee ? 200 : 500,
                result: savedInstitutionEmployee ? 'success' : 'Educational institution employee not edited',
                payload: {
                    data: savedInstitutionEmployee,
                },
            };

            return response;
        } catch (error) {
            this.logger.error(
                `Failed to update educational institution employee with ID ${id}: ${error.message}`,
                error.stack
            );
            throw new NotFoundException(`Failed to update educational institution employee with ID ${id}`);
        }
    }

    

    private generateRandomPassword(): string {
        const passwordLength = 8;
        const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
        const numericChars = '0123456789';
        const specialChars = '!@#$%&*()_+{}:<>?[];,./';
        const allChars = uppercaseChars + lowercaseChars + numericChars + specialChars;

        const getRandomChar = (characters: string) => characters.charAt(Math.floor(Math.random() * characters.length));

        let password = [
            getRandomChar(uppercaseChars),
            getRandomChar(lowercaseChars),
            getRandomChar(numericChars),
            getRandomChar(specialChars),
        ];

        while (password.length < passwordLength) {
            password.push(getRandomChar(allChars));
        }

        password = password.sort(() => Math.random() - 0.5);

        return password.join('');
    }
}
