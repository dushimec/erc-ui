import apiClient from './axios';
import type { ApiResponse, Member } from '../types/api';

export const membersApi = {
    getAllMembers: async (): Promise<ApiResponse<Member[]>> => {
        const response = await apiClient.get('/members');
        return response.data;
    },
    getMemberById: async (id: string): Promise<ApiResponse<Member>> => {
        const response = await apiClient.get(`/members/${id}`);
        return response.data;
    },
    createMember: async (data: Partial<Member>): Promise<ApiResponse<Member>> => {
        const response = await apiClient.post('/members', data);
        return response.data;
    },
    updateMember: async (id: string, data: Partial<Member>): Promise<ApiResponse<Member>> => {
        const response = await apiClient.put(`/members/${id}`, data);
        return response.data;
    },
    deleteMember: async (id: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.delete(`/members/${id}`);
        return response.data;
    }
};
