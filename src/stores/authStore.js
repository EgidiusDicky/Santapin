// src/stores/authStore.js
import { defineStore } from 'pinia';
import api from '../axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
  }),
  actions: {
    async login(credentials) {
      const res = await api.post('/login', credentials);
      this.user = res.data.user;
      this.token = res.data.token;
      localStorage.setItem('token', this.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    },
    async register(data) {
      const res = await api.post('/register', data);
      this.user = res.data.user;
      this.token = res.data.token;
      localStorage.setItem('token', this.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    },
    async fetchProfile() {
      const res = await api.get('/profile');
      this.user = res.data;
    },
    async logout() {
      await api.post('/logout');
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    },
  },
});
