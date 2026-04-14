import apiClient from './axios';
import type { ApiResponse } from '../types/api';

export const contactApi = {
    submitMessage: async (data: any): Promise<ApiResponse<any>> => {
        const response = await apiClient.post('/contact/submit', data);
        return response.data;
    },
    getAllMessages: async (page = 1, limit = 10): Promise<ApiResponse<any[]>> => {
        const response = await apiClient.get(`/contact/messages?page=${page}&limit=${limit}`);
        return response.data;
    },
    markAsRead: async (id: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.patch(`/contact/messages/${id}/read`);
        return response.data;
    },
    deleteMessage: async (id: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.delete(`/contact/messages/${id}`);
        return response.data;
    }
};
