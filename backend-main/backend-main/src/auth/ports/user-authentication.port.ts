import { CreateUserDto } from '../dtos';
import { User } from '../entities/user.entity';

export const USER_AUTHENTICATION_PORT = 'UserAuthenticationPort';

export interface UserAuthenticationPort {
    findUserByEmail(email: string): Promise<User | null>;
    findUserById(userId: string): Promise<User | null>;
    createUser(user: CreateUserDto): Promise<User>;
    updatePassword(user: User, hashedNewPassword: string): Promise<User>;
    saveRecoveryToken(userId: string, token: string): Promise<void>;
    removeRecoveryToken(userId: string): Promise<void>;
}
