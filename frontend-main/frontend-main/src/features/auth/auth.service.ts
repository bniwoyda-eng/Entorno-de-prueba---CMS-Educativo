import { AxiosError } from "axios";
import csmApi from "../../api/csm.api";

import { RecoverPasswordInterface, UserLoginData } from "./auth.interfaces";

export interface LoginResponse {
    user: UserLoginData;
    token: string;
    refreshToken: string;
}

export class AuthService {
    static login = async (email: string, password: string): Promise<LoginResponse> => {
        try {
            const { data } = await csmApi.post<LoginResponse>("/login", {
                email,
                password
            });
            return data;
        } catch (error) {
            console.log(error);
            if (error instanceof AxiosError) throw new Error(error.response?.data);
            throw new Error('Unable to login');
        }
    };

    static checkAuthStatus = async (): Promise<LoginResponse> => {
        try {
            const { data } = await csmApi.get<LoginResponse>("/check-status");
            return data;
        } catch (error) {
            if (error instanceof AxiosError) throw new Error(error.response?.data);
            throw new Error('Unable to check auth status');
        }
    }

    static requestPasswordRecovery = async (email: string): Promise<void> => {
        try {
            await csmApi.post("/request-password-recovery", { email });
        } catch (error) {
            if (error instanceof AxiosError) throw new Error(error.response?.data);
            throw new Error('Unable to send recovery email');
        }
    }

    static recoverPassword = async (values: RecoverPasswordInterface): Promise<void> => {
        try {
            await csmApi.post("/recover-password", { ...values });
        } catch (error) {
            if (error instanceof AxiosError) throw new Error(error.response?.data);
            throw new Error('Unable to recover password');
        }
    }
}