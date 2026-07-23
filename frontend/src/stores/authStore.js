import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/login', credentials);
      localStorage.setItem('token', data.token);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  },

  register: async (userData) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('token', data.token);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      set({ isLoading: false });
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data, isAuthenticated: true });
    } catch {
      localStorage.removeItem('token');
      set({ user: null, isAuthenticated: false });
    }
  }
}));
