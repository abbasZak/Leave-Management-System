import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'employee' | 'manager';
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse stored user:', e);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Starting login request...');
    console.log('API base URL:', api.defaults.baseURL);
    
    try {
      const response = await api.post('/login', { email, password });
      console.log('Full response:', response);
      console.log('Response data:', response.data);
      
      if (!response.data.token) {
        throw new Error('No token received from server');
      }
      
      if (!response.data.user) {
        throw new Error('No user data received from server');
      }
      
      const { user, token } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return user;
    } catch (error: any) {
      console.error('Login error in hook:', error);
      
      // Re-throw with more context
      if (error.response) {
        throw new Error(error.response.data?.message || `Server error: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('No response from server. Check if backend is running.');
      } else {
        throw error;
      }
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    }
  };

  return { user, loading, login, logout };
};