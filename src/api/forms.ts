import apiClient from './axios';
import type {
    YouthFormData,
    CellRecommendationData,
    ChurchRecommendationData,
    BaptismCertificationData,
    MarriageCertificateData,
    WeddingRequestData,
    ChildDedicationData,
    ApiResponse,
} from '../types/forms';

export const formsApi = {
    // Submit youth form
    submitYouthForm: async (data: YouthFormData): Promise<ApiResponse<any>> => {
        const response = await apiClient.post('/forms/youth', data);
        return response.data;
    },

    // Submit cell recommendation
    submitCellRecommendation: async (data: CellRecommendationData): Promise<ApiResponse<any>> => {
        const response = await apiClient.post('/forms/cell-recommendation', data);
        return response.data;
    },

    // Submit church recommendation
    submitChurchRecommendation: async (data: ChurchRecommendationData): Promise<ApiResponse<any>> => {
        const response = await apiClient.post('/forms/church-recommendation', data);
        return response.data;
    },

    // Submit baptism certification
    submitBaptismCertification: async (data: BaptismCertificationData): Promise<ApiResponse<any>> => {
        const response = await apiClient.post('/forms/baptism-certification', data);
        return response.data;
    },

    // Submit marriage certificate
    submitMarriageCertificate: async (data: MarriageCertificateData): Promise<ApiResponse<any>> => {
        const response = await apiClient.post('/forms/marriage-certificate', data);
        return response.data;
    },

    // Submit wedding service request
    submitWeddingRequest: async (data: WeddingRequestData): Promise<ApiResponse<any>> => {
        const response = await apiClient.post('/forms/wedding-request', data);
        return response.data;
    },

    // Submit child dedication request
    submitChildDedication: async (data: ChildDedicationData): Promise<ApiResponse<any>> => {
        const response = await apiClient.post('/forms/child-dedication', data);
        return response.data;
    },

    // Get all forms
    getAllYouthForms: async (): Promise<ApiResponse<any[]>> => {
        const response = await apiClient.get('/forms/youth');
        return response.data;
    },

    getAllCellRecommendations: async (): Promise<ApiResponse<any[]>> => {
        const response = await apiClient.get('/forms/cell-recommendation');
        return response.data;
    },

    getAllChurchRecommendations: async (): Promise<ApiResponse<any[]>> => {
        const response = await apiClient.get('/forms/church-recommendation');
        return response.data;
    },

    getAllBaptismCertifications: async (): Promise<ApiResponse<any[]>> => {
        const response = await apiClient.get('/forms/baptism-certification');
        return response.data;
    },

    getAllMarriageCertificates: async (): Promise<ApiResponse<any[]>> => {
        const response = await apiClient.get('/forms/marriage-certificate');
        return response.data;
    },

    getAllWeddingServiceRequests: async (): Promise<ApiResponse<any[]>> => {
        const response = await apiClient.get('/forms/wedding-request');
        return response.data;
    },

    getAllChildDedicationRequests: async (): Promise<ApiResponse<any[]>> => {
        const response = await apiClient.get('/forms/child-dedication');
        return response.data;
    },

    // Confirm/Reject forms
    confirmForm: async (formType: string, formId: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.patch(`/forms/${formType}/${formId}/confirm`);
        return response.data;
    },

    rejectForm: async (formType: string, formId: string, reason?: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.patch(`/forms/${formType}/${formId}/reject`, { reason });
        return response.data;
    },
};
