// src/axios.js
import axios from 'axios'
import router from '@/router' // Menggunakan alias @ untuk konsistensi
import { useAuthStore } from '@/stores/authStore'; // Import authStore

const axiosClient = axios.create({
    baseURL: 'http://localhost:8000/api',
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
        // Ini penting agar Pinia store bisa diakses di sini
        const authStore = useAuthStore();
        // Cek apakah error adalah 401
        if (error.response && error.response.status === 401) {
            // Dapatkan URL endpoint yang memicu error 401
            // Kita perlu membersihkan baseURL untuk mendapatkan path relatif
            const requestUrl = error.response.config.url.replace(axiosClient.defaults.baseURL, '');

            // Jika error 401 BUKAN dari endpoint login atau admin-login
            if (requestUrl !== '/login' && requestUrl !== '/admin-login') {
                console.log('401 Unauthorized caught by interceptor (not a login endpoint). Clearing local storage and redirecting.');
                // Gunakan fungsi logout dari authStore untuk membersihkan state dan meredirect
                // Fungsi logout sudah menangani localStorage.removeItem() dan router.push('/login')
                authStore.logout();
            } else {
                // Jika 401 berasal dari endpoint login, biarkan error ini diproses di blok catch
                // dalam fungsi login/adminLogin di authStore.js. Interceptor tidak akan meredirect.
                console.log('401 Unauthorized from login endpoint, handled locally.');
            }
        }
        return Promise.reject(error) // Tetap teruskan error agar bisa ditangkap di tempat lain (misal di authStore)
    }
)

export default axiosClient