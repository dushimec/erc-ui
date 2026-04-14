import apiClient from './axios';
import type { ApiResponse } from '../types/api';

export const overviewApi = {
    getStats: async (): Promise<ApiResponse<any>> => {
        const response = await apiClient.get('/overview/stats');
        return response.data;
    }
};
