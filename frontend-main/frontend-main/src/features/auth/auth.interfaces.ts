import { Role } from "../../constants/roles";

export type AuthStatus = 'unauthenticated' | 'authenticating' | 'authenticated';

export interface UserLoginData {
    id: string;
    profilePicture: string;
    email: string;
    fullName: string;
    isActive: boolean;
    roles: Role[];
    educatorId?: string;
    studentId?: string;
}

export interface RecoverPasswordInterface {
    token: string;
    newPassword: string;
}