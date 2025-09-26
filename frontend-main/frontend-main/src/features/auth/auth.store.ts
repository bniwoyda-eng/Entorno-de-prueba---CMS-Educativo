import { create, StateCreator } from "zustand";
import type { AuthStatus, UserLoginData } from "./auth.interfaces";
import { AuthService } from "./auth.service";
import { devtools, persist } from "zustand/middleware";
import { queryClient } from "../../main";
export interface AuthState {
    status: AuthStatus;

    user?: UserLoginData;
    token?: string;
    refreshToken?: string;

    login: (email: string, password: string) => Promise<UserLoginData>;
    checkAuthStatus: () => void;
    logout: () => void;
}

const storeApi: StateCreator<AuthState> = (set) => ({
    status: 'authenticating',
    token: undefined,
    user: undefined,

    login: async (email, password) => {
        try {
            const { token, refreshToken, user } = await AuthService.login(email, password);
            set({ status: 'authenticated', user, token, refreshToken });
            return user;
        } catch (error) {
            set({ status: 'unauthenticated', user: undefined, token: undefined, refreshToken: undefined });
            throw 'Unable to login';
        }
    },

    checkAuthStatus: async () => {
        try {
            const { token, refreshToken, user } = await AuthService.checkAuthStatus();
            set({ status: 'authenticated', user, token, refreshToken });
        } catch (error) {
            set({ status: 'unauthenticated', user: undefined, token: undefined, refreshToken: undefined });
        }
    },

    logout: () => {
        set({ status: 'unauthenticated', user: undefined, token: undefined, refreshToken: undefined });
        setTimeout(() => {
            queryClient.clear();
        }, 1000);
    }
});

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(storeApi, { name: 'auth-storage' })
    )
);