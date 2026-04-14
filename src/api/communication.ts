import apiClient from './axios';
import type { ApiResponse } from '../types/api';

export const communicationApi = {
    getNotifications: async (): Promise<ApiResponse<any[]>> => {
        const response = await apiClient.get('/communication/notifications');
        return response.data;
    },
    markRead: async (id: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.patch(`/communication/notifications/${id}/read`);
        return response.data;
    },
    sendMessage: async (data: any): Promise<ApiResponse<any>> => {
        const response = await apiClient.post('/communication/messages', data);
        return response.data;
    }
};
