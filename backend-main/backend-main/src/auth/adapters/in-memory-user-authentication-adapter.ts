import { UserAuthenticationPort } from '../ports/user-authentication.port';
import { CreateUserDto } from '../dtos';
import { User } from '../entities/user.entity';

// This adapter is used for testing purposes only
export class InMemoryUserAuthenticationAdapter implements UserAuthenticationPort {
    private users: User[] = [];

    async findUserByEmail(email: string): Promise<User | null> {
        return this.users.find((user) => user.email === email) || null;
    }

    async findUserById(userId: string): Promise<User | null> {
        return this.users.find((user) => user.id === userId) || null;
    }

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const user = new User();
        if (await this.findUserByEmail(createUserDto.email)) {
            throw new Error('User already exists');
        }
        Object.assign(user, createUserDto);
        this.users.push(user);
        return user;
    }

    async updatePassword(user: User, hashedNewPassword: string): Promise<User> {
        const userIndex = this.users.findIndex((u) => u.id === user.id);
        if (userIndex === -1) {
            throw new Error('User not found');
        }
        this.users[userIndex].password = hashedNewPassword;
        return this.users[userIndex];
    }

    async saveRecoveryToken(userId: string, token: string): Promise<void> {
        // Implementación para guardar el token en la base de datos
    }

    async removeRecoveryToken(userId: string): Promise<void> {
        // Implementación para eliminar el token de la base de datos
    }
}
