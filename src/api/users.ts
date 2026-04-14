import apiClient from './axios';
import type { ApiResponse, User } from '../types/api';

export const usersApi = {
    getAllUsers: async (params?: any): Promise<ApiResponse<User[]>> => {
        const response = await apiClient.get('/users', { params });
        return response.data;
    },
    createUser: async (data: any): Promise<ApiResponse<User>> => {
        const response = await apiClient.post('/users', data);
        return response.data;
    },
    getUserById: async (id: string): Promise<ApiResponse<User>> => {
        const response = await apiClient.get(`/users/${id}`);
        return response.data;
    },
    getMe: async (): Promise<ApiResponse<User>> => {
        const response = await apiClient.get('/users/me');
        return response.data;
    },
    updateProfile: async (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
        const response = await apiClient.patch(`/users/${id}`, data);
        return response.data;
    },
    updateRole: async (id: string, role: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.patch(`/users/${id}/role`, { role });
        return response.data;
    },
    deleteUser: async (id: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.patch(`/users/${id}/delete`);
        return response.data;
    },
    resendVerification: async (id: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.post(`/users/${id}/resend-code`);
        return response.data;
    }
};
