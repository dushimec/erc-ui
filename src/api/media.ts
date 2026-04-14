import apiClient from './axios';
import type { ApiResponse } from '../types/api';

export const mediaApi = {
    getAllMedia: async (): Promise<ApiResponse<any[]>> => {
        const response = await apiClient.get('/media');
        return response.data;
    },
    uploadMedia: async (data: any): Promise<ApiResponse<any>> => {
        const response = await apiClient.post('/media', data);
        return response.data;
    },
    deleteMedia: async (id: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.delete(`/media/${id}`);
        return response.data;
    },
    updateMedia: async (id: string, data: any): Promise<ApiResponse<any>> => {
        const response = await apiClient.put(`/media/${id}`, data);
        return response.data;
    }
};
