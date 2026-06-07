import { api } from './api';
import { setAccessToken, clearAccessToken } from './auth-token';

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
}

export interface AuthUser {
    id: number;
    email: string;
}

export const refreshSession = async (): Promise<string> => {
    const response = await api.post<{ accessToken: string }>(
        '/auth/refresh',
        {},
        { skipAuthRefresh: true }
    );
    setAccessToken(response.data.accessToken);
    return response.data.accessToken;
};

export const login = async (data: LoginData): Promise<AuthUser> => {
    const response = await api.post<{ accessToken: string }>('/auth/login', data);
    setAccessToken(response.data.accessToken);
    return fetchUserProfile();
};

export const register = async (data: RegisterData): Promise<AuthUser> => {
    const response = await api.post<{ accessToken: string }>('/auth/register', data);
    setAccessToken(response.data.accessToken);
    return fetchUserProfile();
};

export const logout = async (): Promise<void> => {
    await api.post('/auth/logout');
    clearAccessToken();
};

export const fetchUserProfile = async (): Promise<AuthUser> => {
    const response = await api.get<{ user: AuthUser }>('/auth/me');
    return response.data.user;
};
