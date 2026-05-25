// src/api/auth.ts
import api from './client';
import type { User, LoginCredentials } from '../types';

export const authApi = {
    login: async (credentials: LoginCredentials) => {
        const response = await api.post('/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },
    
    logout: async () => {
        await api.post('/logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    
    getCurrentUser: (): User | null => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },
};