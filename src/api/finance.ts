import apiClient from './axios';
import type { ApiResponse, Contribution } from '../types/api';

export const financeApi = {
    getAllContributions: async (): Promise<ApiResponse<Contribution[]>> => {
        const response = await apiClient.get('/finance');
        return response.data;
    },
    submitContribution: async (data: any): Promise<ApiResponse<Contribution>> => {
        const response = await apiClient.post('/finance', data);
        return response.data;
    },
    verifyContribution: async (id: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.patch(`/finance/${id}/verify`);
        return response.data;
    }
};
