import { Role } from "../constants/roles";
import { getPalleteByRole } from "./get-pallete-by-role";

export type BaseColor = 'purple' | 'red' | 'sky' | 'violet' | 'gray';

interface Variants {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    DEFAULT: string;
}

const colorsPallete: Record<BaseColor, Variants> = {
    purple: {
        50: '#F3F6FF',
        100: '#E2E7FF',
        200: '#BFC7F9',
        300: '#7582CB',
        400: '#404D93',
        500: '#2E3871',
        DEFAULT: '#2E3871',
    },
    red: {
        50: '#FEF2F2',
        100: '#FEE2E2',
        200: '#FCA5A5',
        300: '#F87171',
        400: '#EF4444',
        500: '#DC2626',
        DEFAULT: '#DC2626',
    },
    sky: {
        50: '#F0F9FF',
        100: '#E0F2FE',
        200: '#BAE6FD',
        300: '#7DD3FC',
        400: '#38a6d5',
        500: '#2f8db6',
        DEFAULT: '#2f8db6',
    },
    violet: {
        50: '#F5F3FF',
        100: '#EDE9FE',
        200: '#DDD6FE',
        300: '#A78BFA',
        400: '#8B5CF6',
        500: '#6D28D9',
        DEFAULT: '#6D28D9',
    },
    gray: {
        50: '#E5E7EB',
        100: '#D1D5DB',
        200: '#9CA3AF',
        300: '#4B5563',
        400: '#374151',
        500: '#1F2937',
        DEFAULT: '#111827',
    },
};

export const generatePallete = (role?: Role) => {
    const color = getPalleteByRole(role);
    const pallete = colorsPallete[color];

    Object.keys(pallete).forEach((key) => {
        document.documentElement.style.setProperty(
            `--color-main-${key}`,
            pallete[key as keyof Variants]
        );
    });
};
