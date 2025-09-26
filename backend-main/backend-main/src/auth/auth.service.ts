import { Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { InstitutionEmployees } from 'src/institutions/entities';
import { AbstractResponse } from 'src/common/interfaces';
import { EmailService } from 'src/email/email.service';
import { Repository } from 'typeorm';
import { ChangePasswordDto, CreateUserDto, LoginUserDto, RecoverPasswordDto, RequestPasswordRecoveryDto } from './dtos';
import { User } from './entities/user.entity';
import { IPayload } from './interfaces/payload.interface';
import { USER_AUTHENTICATION_PORT, UserAuthenticationPort } from './ports/user-authentication.port';
import { Student } from 'src/exports/entities';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        @InjectRepository(InstitutionEmployees)
        private readonly institutionEmployeesRepository: Repository<InstitutionEmployees>,
        @InjectRepository(Student)
        private readonly studentsRepository: Repository<Student>,
        @Inject(USER_AUTHENTICATION_PORT)
        private readonly userAuthenticationPort: UserAuthenticationPort,
        private readonly jwtService: JwtService,
        private readonly emailService: EmailService
    ) { }

    async authenticateUser(
        loginUserDto: LoginUserDto
    ): Promise<{ user: IPayload; token: string; refreshToken: string }> {
        const { email, password } = loginUserDto;
        const user = await this.userAuthenticationPort.findUserByEmail(email);

        if (!user || !bcrypt.compareSync(password, user.password)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = await this.createPayload(user);
        const token = this.getJwtToken({ id: payload.id });
        const refreshToken = this.getRefreshToken(payload);

        delete user.password;
        this.logger.debug(`User ${user.email} authenticated successfully`);
        return { user: payload, token, refreshToken };
    }

    async refreshToken(oldRefreshToken: string): Promise<{ token: string }> {
        try {
            const payload = this.jwtService.verify(oldRefreshToken);
            const user = await this.userAuthenticationPort.findUserById(payload.id);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const newPayload = await this.createPayload(user);
            const newToken = this.getJwtToken(newPayload);

            return { token: newToken };
        } catch (error) {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async registerUser(createUserDto: CreateUserDto): Promise<{ user: User; token: string; refreshToken: string }> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const userDtoWithHashedPassword = {
            ...createUserDto,
            password: hashedPassword,
        };

        const user = await this.userAuthenticationPort.createUser(userDtoWithHashedPassword);
        if (createUserDto.employeeId) {
            const employee = await this.institutionEmployeesRepository.findOne({
                where: { id: createUserDto.employeeId.toString() },
            });
        }
        if (createUserDto.studentId) {
            const student = await this.studentsRepository.findOne({
                where: { id: createUserDto.studentId.toString() },
            });
            if (student) {
                user.student = student;
            }
        }
        const payload = await this.createPayload(user);
        const token = this.getJwtToken(payload);
        const refreshToken = this.getRefreshToken(payload);
        delete user.password;

        return { user, token, refreshToken };
    }

    async changePassword(changePasswordDto: ChangePasswordDto): Promise<{ user: User; token: string }> {
        const { email, currentPassword, newPassword } = changePasswordDto;

        // Buscamos el usuario por email y verificamos que la contraseña actual sea correcta
        const user = await this.userAuthenticationPort.findUserByEmail(email);
        if (!user || !bcrypt.compareSync(currentPassword, user.password)) throw new UnauthorizedException('Invalid credentials');
        if (bcrypt.compareSync(newPassword, user.password)) throw new UnauthorizedException('The new password must be different from the current password.');

        // Encriptamos la nueva contraseña y la actualizamos en la base de datos
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.userAuthenticationPort.updatePassword(user, hashedNewPassword);

        // Creamos el payload con los datos del usuario y generamos un nuevo token
        const payload = await this.createPayload(user);
        const token = this.getJwtToken(payload);

        // Enviamos un email al usuario con la confirmación del cambio de contraseña
        if (token) await this.emailService.sendChangePasswordEmail(user.email);
        delete user.password;

        return { user, token };
    }

    async sendPasswordRecoveryEmail(requestPasswordRecoveryDto: RequestPasswordRecoveryDto): Promise<AbstractResponse<any>> {

        // Si el usuario existe, guardamos el token de recuperación en la BBDD y enviamos un email con el token
        const { email } = requestPasswordRecoveryDto;
        const user = await this.userAuthenticationPort.findUserByEmail(email);
        if (user) {
            const payload = await this.createPayload(user);
            const token = this.getJwtToken(payload);
            await this.userAuthenticationPort.saveRecoveryToken(user.id, token);
            await this.emailService.sendPasswordRecoveryEmail(email, token);
        }

        return {
            code: 200,
            result: 'success',
            payload: {
                data: 'If you have an account with us, you will receive an email with instructions to recover your password.',
            },
        };
    }

    async recoverPassword(recoverPasswordDto: RecoverPasswordDto): Promise<AbstractResponse<any>> {
        const { token, newPassword } = recoverPasswordDto;
        const payload = this.jwtService.verify(token);

        const user = await this.userAuthenticationPort.findUserById(payload.id);
        if (!user) throw new NotFoundException('User not found');
        if (user.recoveryToken !== token || user.recoveryTokenExpires < new Date()) throw new UnauthorizedException('Invalid token');

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.userAuthenticationPort.updatePassword(user, hashedNewPassword);
        await this.userAuthenticationPort.removeRecoveryToken(user.id);
        await this.emailService.sendChangePasswordEmail(user.email);

        return {
            code: 200,
            result: 'success',
            payload: {
                data: 'Password updated successfully.',
            },
        };
    }

    private getJwtToken(payload: { id: string; employeeId?: string }): string {
        return this.jwtService.sign(payload, { expiresIn: '12h' });
    }

    private getRefreshToken(payload: { id: string; employeeId?: string }): string {
        return this.jwtService.sign(payload, { expiresIn: '7d' });
    }

    private async createPayload(user: User): Promise<IPayload> {

        const payload: IPayload = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            isActive: user.is_deleted ? false : true,
            roles: user.roles,
        };

        if (user.student) {
            payload.studentId = user.student.id;
            payload.profilePicture = user.student.profilePicture;
        }
        if (user.educator) {
            payload.educatorId = user.educator.id;
            payload.profilePicture = user.educator.profilePicture;
        }

        return payload;
    }

    // MAB 20/03: Método para verificar el estado de autenticación de un usuario logueado
    // Necesario en el frontend para volver a tener la información del usuario en el estado global
    // en caso de que se actualice la página o se cierre y vuelva a abrir el navegador
    async checkAuthStatus(user: User): Promise<{ user: IPayload; token: string; refreshToken: string }> {
        try {
            const payload = await this.createPayload(user);
            const token = this.getJwtToken({ id: payload.id });
            const refreshToken = this.getRefreshToken(payload);

            delete user.password;
            this.logger.debug(`Auth status verified successfully (${user.email})`);
            return { user: payload, token, refreshToken };
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}
