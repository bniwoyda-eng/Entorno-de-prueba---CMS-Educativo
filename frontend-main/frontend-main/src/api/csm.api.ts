import axios from "axios";
import { getEnvs } from "../config";
import { useAuthStore } from "../features/auth/auth.store";

const { VITE_BACKEND_URL } = getEnvs();

const csmApi = axios.create({
    baseURL: VITE_BACKEND_URL,
});

csmApi.interceptors.request.use((config) => {

    // * Zustand (used as method, not hook)
    const token = useAuthStore.getState().token;

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
});

export default csmApi;