import apiClient from './axios';
import type { ApiResponse } from '../types/api';

export const websiteApi = {
    getAboutSections: async (): Promise<ApiResponse<any[]>> => {
        const response = await apiClient.get('/website/about');
        return response.data;
    },
    upsertAboutSection: async (data: { type: string, title: string, content: string }): Promise<ApiResponse<any>> => {
        const response = await apiClient.post('/website/about', data);
        return response.data;
    },
    getLeadership: async (): Promise<ApiResponse<any[]>> => {
        const response = await apiClient.get('/website/leadership');
        return response.data;
    },
    addLeadership: async (data: any): Promise<ApiResponse<any>> => {
        const response = await apiClient.post('/website/leadership', data);
        return response.data;
    },
    updateLeadership: async (id: string, data: any): Promise<ApiResponse<any>> => {
        const response = await apiClient.put(`/website/leadership/${id}`, data);
        return response.data;
    },
    deleteLeadership: async (id: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.delete(`/website/leadership/${id}`);
        return response.data;
    },
    getContactInfo: async (): Promise<ApiResponse<any>> => {
        const response = await apiClient.get('/website/info');
        return response.data;
    },
    upsertContactInfo: async (data: any): Promise<ApiResponse<any>> => {
        const response = await apiClient.post('/website/info', data);
        return response.data;
    }
};
