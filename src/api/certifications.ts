import apiClient from './axios';
import type { MarriageRequestData, BaptismRequestData, ApiResponse } from '../types/forms';

export const certificationApi = {
    // Submit marriage certification request
    submitMarriageRequest: async (data: MarriageRequestData): Promise<ApiResponse<any>> => {
        const response = await apiClient.post('/certifications/marriage', data);
        return response.data;
    },

    // Submit baptism certification request
    submitBaptismRequest: async (data: BaptismRequestData): Promise<ApiResponse<any>> => {
        const response = await apiClient.post('/certifications/baptism', data);
        return response.data;
    },

    // Get all marriage requests
    getAllMarriageRequests: async (): Promise<ApiResponse<any[]>> => {
        const response = await apiClient.get('/certifications/marriage');
        return response.data;
    },

    // Get all baptism requests
    getAllBaptismRequests: async (): Promise<ApiResponse<any[]>> => {
        const response = await apiClient.get('/certifications/baptism');
        return response.data;
    },

    // Confirm/Reject certification requests
    confirmMarriageRequest: async (requestId: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.patch(`/forms/marriage-request/${requestId}/confirm`);
        return response.data;
    },

    rejectMarriageRequest: async (requestId: string, reason?: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.patch(`/forms/marriage-request/${requestId}/reject`, { reason });
        return response.data;
    },

    confirmBaptismRequest: async (requestId: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.patch(`/forms/baptism-request/${requestId}/confirm`);
        return response.data;
    },

    rejectBaptismRequest: async (requestId: string, reason?: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.patch(`/forms/baptism-request/${requestId}/reject`, { reason });
        return response.data;
    },
};
