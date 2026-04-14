import apiClient from './axios';
import type { ApiResponse, Event } from '../types/api';

export const communityApi = {
    getAllEvents: async (): Promise<ApiResponse<Event[]>> => {
        const response = await apiClient.get('/community');
        return response.data;
    },
    getEventById: async (id: string): Promise<ApiResponse<Event>> => {
        const response = await apiClient.get(`/community/${id}`);
        return response.data;
    },
    createEvent: async (data: any): Promise<ApiResponse<Event>> => {
        const response = await apiClient.post('/community', data);
        return response.data;
    },
    registerForEvent: async (eventId: string, userId: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.post(`/community/${eventId}/register`, { userId });
        return response.data;
    },
    updateEvent: async (id: string, data: any): Promise<ApiResponse<Event>> => {
        const response = await apiClient.put(`/community/${id}`, data);
        return response.data;
    },
    deleteEvent: async (id: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.delete(`/community/${id}`);
        return response.data;
    }
};
