import apiClient from './axios';
import type { ApiResponse, Service } from '../types/api';

export const servicesApi = {
    getAllServices: async (): Promise<ApiResponse<Service[]>> => {
        const response = await apiClient.get('/services');
        return response.data;
    },
    getServiceById: async (id: string): Promise<ApiResponse<Service>> => {
        const response = await apiClient.get(`/services/${id}`);
        return response.data;
    },
    createService: async (serviceData: any): Promise<ApiResponse<Service>> => {
        const response = await apiClient.post('/services', serviceData);
        return response.data;
    },
    updateService: async (id: string, serviceData: any): Promise<ApiResponse<Service>> => {
        const response = await apiClient.put(`/services/${id}`, serviceData);
        return response.data;
    },
    deleteService: async (id: string): Promise<ApiResponse<void>> => {
        const response = await apiClient.delete(`/services/${id}`);
        return response.data;
    }
};
