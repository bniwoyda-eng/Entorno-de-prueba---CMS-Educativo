import { User } from './user.entity';

export class AuthenticatedUser extends User {
    token: string;
}
