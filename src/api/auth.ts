import apiClient from './axios';
import type { ApiResponse } from '../types/api';

export const authApi = {
    login: async (data: any): Promise<ApiResponse<any>> => {
        const response = await apiClient.post('/auth/login', data);
        const resData = response.data;
        // Backend returns accessToken at root, and user at root
        const token = resData.accessToken || resData.data?.token;
        const user = resData.user || resData.data?.user;

        if (resData.success && token) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        }
        return resData;
    },
    register: async (data: any): Promise<ApiResponse<any>> => {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    verify2FA: async (data: { email: string; code: string }): Promise<ApiResponse<any>> => {
        const response = await apiClient.post('/auth/verify-2fa', data);
        const resData = response.data;
        const token = resData.accessToken || resData.data?.token;
        const user = resData.user || resData.data?.user;

        if (resData.success && token) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        }
        return resData;
    },
    verifyEmail: async (data: { email: string; code: string }): Promise<ApiResponse<any>> => {
        const response = await apiClient.post('/auth/verify-email', data);
        const resData = response.data;
        const token = resData.accessToken || resData.data?.token;
        const user = resData.user || resData.data?.user;

        if (resData.success && token) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        }
        return resData;
    }
};
