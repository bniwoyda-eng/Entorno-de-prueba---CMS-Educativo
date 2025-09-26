import { Role, Roles } from "../constants/roles";
import { BaseColor } from "./generate-pallete";

export const getPalleteByRole = (role?: Role): BaseColor => {
    const roleRedirectMap: Record<Role, BaseColor> = {
        [Roles.STUDENT]: "purple",
        [Roles.EDUCATOR]: "purple",
        [Roles.INSTITUTION]: "purple",
        [Roles.ADMIN]: "gray",
    };

    if (!role) return "purple"; 
    return roleRedirectMap[role] || "purple";
};
