import api from './client';
// import type { LeaveRequest, EmployeeStats, AdminStats } from '../types';

export const leavesApi = {
    getAll: async (params?: { status?: string; leave_type?: string; search?: string }) => {
        const response = await api.get('/leave-requests', { params });
        return response.data;
    },
    
    create: async (data: any) => {
        const response = await api.post('/leave-requests', data);
        return response.data;
    },
    
    update: async (id: number, data: any) => {
        const response = await api.put(`/leave-requests/${id}`, data);
        return response.data;
    },
    
    delete: async (id: number) => {
        await api.delete(`/leave-requests/${id}`);
    },
    
    approve: async (id: number, comment?: string) => {
        const response = await api.put(`/leave-requests/${id}/approve`, { comment });
        return response.data;
    },
    
    reject: async (id: number, comment: string) => {
        const response = await api.put(`/leave-requests/${id}/reject`, { comment });
        return response.data;
    },
    
    getStats: async () => {
        const response = await api.get('/dashboard/stats');
        return response.data;
    },
};