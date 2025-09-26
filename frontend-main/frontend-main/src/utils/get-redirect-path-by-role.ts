import { Role, Roles } from "../constants/roles";

export const getRedirectPathByRole = (role?: Role): string => {
    const roleRedirectMap: Record<Role, string> = {
        [Roles.STUDENT]: "/students",
        [Roles.EDUCATOR]: "/educators",
        [Roles.INSTITUTION]: "/institutions",
        [Roles.ADMIN]: "/admin",
    };

    return role && roleRedirectMap[role] ? roleRedirectMap[role] : "/";
};
