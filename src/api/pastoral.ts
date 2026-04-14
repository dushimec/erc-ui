import apiClient from './axios';
import type { ApiResponse, PrayerRequest, CounselingAppointment } from '../types/api';

export const pastoralApi = {
    getAllPrayerRequests: async (): Promise<ApiResponse<PrayerRequest[]>> => {
        const response = await apiClient.get('/pastoral/prayer-requests');
        return response.data;
    },
    createPrayerRequest: async (data: any): Promise<ApiResponse<PrayerRequest>> => {
        const response = await apiClient.post('/pastoral/prayer-requests', data);
        return response.data;
    },
    respondToPrayerRequest: async (id: string, response_text: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.patch(`/pastoral/prayer-requests/${id}/respond`, { response: response_text });
        return response.data;
    },
    getAllAppointments: async (): Promise<ApiResponse<CounselingAppointment[]>> => {
        const response = await apiClient.get('/pastoral/counseling-appointments');
        return response.data;
    },
    scheduleAppointment: async (data: any): Promise<ApiResponse<any>> => {
        const response = await apiClient.post('/pastoral/counseling-appointments', data);
        return response.data;
    },
    updateAppointmentStatus: async (id: string, status: string): Promise<ApiResponse<any>> => {
        const response = await apiClient.patch(`/pastoral/counseling-appointments/${id}/status`, { status });
        return response.data;
    }
};
