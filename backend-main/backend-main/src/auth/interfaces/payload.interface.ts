export interface IPayload {
    id: string;
    email: string;
    fullName: string;
    profilePicture?: string;
    isActive: boolean;
    roles: string[];
    educatorId?: string;
    studentId?: string;
}
