import apiClient from './axios';
import type { ApiResponse, Sermon } from '../types/api';

export const sermonsApi = {
    getAllSermons: async (): Promise<ApiResponse<Sermon[]>> => {
        const response = await apiClient.get('/sermons');
        return response.data;
    },
    getSermonById: async (id: string): Promise<ApiResponse<Sermon>> => {
        const response = await apiClient.get(`/sermons/${id}`);
        return response.data;
    },
    createSermon: async (data: any): Promise<ApiResponse<Sermon>> => {
        const response = await apiClient.post('/sermons', data);
        return response.data;
    },
    updateSermon: async (id: string, data: any): Promise<ApiResponse<Sermon>> => {
        const response = await apiClient.put(`/sermons/${id}`, data);
        return response.data;
    },
    deleteSermon: async (id: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.delete(`/sermons/${id}`);
        return response.data;
    }
};
