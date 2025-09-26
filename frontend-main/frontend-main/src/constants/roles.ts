// constants/roles.ts
export const Roles = {
    STUDENT: "student",
    EDUCATOR: "educator",
    INSTITUTION: "institution",
    ADMIN: "admin",
} as const;

export type Role = (typeof Roles)[keyof typeof Roles];