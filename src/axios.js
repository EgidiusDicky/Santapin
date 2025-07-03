// src/axios.js
import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/authStore';

const axiosClient = axios.create({
    // THIS IS THE CRUCIAL CHANGE: Use VITE_APP_URL
    baseURL: import.meta.env.VITE_APP_URL,
    headers: {
        Accept: 'application/json',
    },
})

// Set the Authorization header before each request
axiosClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Handle 401 globally, but exclude login/admin-login endpoints
axiosClient.interceptors.response.use(
    response => response,
    error => {
        // Mendapatkan instance authStore di dalam interceptor
        const authStore = useAuthStore();
        // Cek apakah error adalah 401
        if (error.response && error.response.status === 401) {
            // Dapatkan URL endpoint yang memicu error 401
            const requestUrl = error.response.config.url.replace(axiosClient.defaults.baseURL, '');

            // Jika error 401 BUKAN dari endpoint login atau admin-login
            if (requestUrl !== '/login' && requestUrl !== '/admin-login') {
                console.log('401 Unauthorized caught by interceptor (not a login endpoint). Clearing local storage and redirecting.');
                authStore.logout();
            } else {
                console.log('401 Unauthorized from login endpoint, handled locally.');
            }
        }
        return Promise.reject(error)
    }
)

export default axiosClient