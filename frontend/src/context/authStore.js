import { create } from 'zustand';
import api from '../utils/api';

const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('wandr_user') || 'null'),
  token: localStorage.getItem('wandr_token') || null,
  loading: false,
  error: null,

  setUser: (user) => {
    set({ user });
    localStorage.setItem('wandr_user', JSON.stringify(user));
  },

  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/register', data);
      const { token, user } = res.data;
      localStorage.setItem('wandr_token', token);
      localStorage.setItem('wandr_user', JSON.stringify(user));
      set({ user, token, loading: false });
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || 'Registration failed';
      set({ loading: false, error });
      return { success: false, error };
    }
  },

  login: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await api.post('/auth/login', data);
      const { token, user } = res.data;
      localStorage.setItem('wandr_token', token);
      localStorage.setItem('wandr_user', JSON.stringify(user));
      set({ user, token, loading: false });
      return { success: true };
    } catch (err) {
      const error = err.response?.data?.message || 'Login failed';
      set({ loading: false, error });
      return { success: false, error };
    }
  },

  logout: async () => {
    try { await api.post('/auth/logout'); } catch (e) {}
    localStorage.removeItem('wandr_token');
    localStorage.removeItem('wandr_user');
    set({ user: null, token: null });
  },

  getMe: async () => {
    try {
      const res = await api.get('/auth/me');
      set({ user: res.data.user });
      localStorage.setItem('wandr_user', JSON.stringify(res.data.user));
    } catch (e) {
      // Only a real auth failure (invalid/expired token) should log the user out.
      // Transient failures (rate limiting, network errors, server hiccups) must not
      // clear a perfectly valid session.
      if (e.response?.status === 401) {
        get().logout();
      }
    }
  },

  updatePassword: async (data) => {
    set({ loading: true });
    try {
      const res = await api.put('/auth/update-password', data);
      const { token, user } = res.data;
      localStorage.setItem('wandr_token', token);
      localStorage.setItem('wandr_user', JSON.stringify(user));
      set({ user, token, loading: false });
      return { success: true };
    } catch (err) {
      set({ loading: false });
      return { success: false, error: err.response?.data?.message };
    }
  },

  isAdmin: () => {
    const user = get().user;
    return user?.role === 'admin' || user?.role === 'superadmin';
  },

  isAuthenticated: () => !!get().token && !!get().user,
}));

export default useAuthStore;
