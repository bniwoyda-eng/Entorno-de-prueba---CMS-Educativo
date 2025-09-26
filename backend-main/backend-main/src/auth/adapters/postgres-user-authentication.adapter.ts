import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { UserAuthenticationPort } from '../ports/user-authentication.port';
import { CreateUserDto } from '../dtos';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class PostgresUserAuthenticationAdapter implements UserAuthenticationPort {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async findUserByEmail(email: string): Promise<User | null> {
        try {
            return await this.userRepository.findOne({
                where: { email, is_deleted: false },
                select: ['id', 'fullName', 'email', 'password', 'roles'],
                relations: ['educator', 'student'],
            });
        } catch (error) {
            Logger.error(error);
        }
    }

    async findUserById(userId: string): Promise<User | null> {
        try {
            return await this.userRepository.findOne({
                where: { id: userId, is_deleted: false },
                select: ['id', 'email', 'password', 'roles', 'recoveryToken'],
                relations: ['educator', 'student'],
            });
        } catch (error) {
            Logger.error(error);
        }
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        try {
            const user = this.userRepository.create(createUserDto);
            await this.userRepository.save(user);
            return user;
        } catch (error) {
            this.handleDBError(error);
        }
    }

    async updatePassword(user: User, hashedNewPassword: string): Promise<User> {
        try {
            user.password = hashedNewPassword;
            await this.userRepository.save(user);
            return user;
        } catch (error) {
            this.handleDBError(error);
        }
    }

    async saveRecoveryToken(userId: string, token: string): Promise<void> {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            user.recoveryToken = token;
            user.recoveryTokenExpires = new Date(Date.now() + 1200000); //20 Min to expire
            await this.userRepository.save(user);
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException('Could not save recovery token');
        }
    }

    async removeRecoveryToken(userId: string): Promise<void> {
        try {
            const user = await this.userRepository.findOne({ where: { id: userId } });
            if (!user) {
                throw new NotFoundException('User not found');
            }
            user.recoveryToken = null;
            user.recoveryTokenExpires = null;
            await this.userRepository.save(user);
        } catch (error) {
            Logger.error(error);
            throw new InternalServerErrorException('Could not remove recovery token');
        }
    }

    private handleDBError(error: any): never {
        if (error.code === '23505') {
            throw new BadRequestException(`User already exists ${error.detail}`);
        }
        throw new InternalServerErrorException('Internal Server Error');
    }
}
