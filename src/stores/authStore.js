// src/stores/authStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axiosClient from '@/axios'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
    const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
    const token = ref(localStorage.getItem('token'))
    const isAuthenticated = ref(!!localStorage.getItem('token'))
    const isAdmin = ref(!!localStorage.getItem('isAdminLoggedIn'))
    const error = ref(null) // State untuk menyimpan pesan error
    const loading = ref(false) // State untuk indikator loading

    function setAuthData(userData, authToken, isAdminUser) {
        user.value = userData
        token.value = authToken
        isAuthenticated.value = true
        isAdmin.value = isAdminUser
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', authToken)
        localStorage.setItem('isAdminLoggedIn', isAdminUser ? 'true' : 'false')
    }

    // Fungsi untuk login biasa (user)
    async function login(credentials) {
        loading.value = true;
        error.value = null;
        try {
            const response = await axiosClient.post('/login', credentials)
            const data = response.data.data
            setAuthData(data.user, data.token, data.user.role.value === 'admin')

            router.push('/')
            return true
        } catch (err) {
            console.error('Login gagal:', err.response?.data || err.message);
            error.value = err.response?.data?.message || 'Login gagal. Silakan periksa email dan password Anda.';
            return false
        } finally {
            loading.value = false;
        }
    }

    // Fungsi untuk login admin
    async function adminLogin(credentials) {
        loading.value = true;
        error.value = null;
        try {
            const response = await axiosClient.post('/admin-login', credentials)
            const data = response.data.data
            setAuthData(data.user, data.token, true)

            router.push('/admin/dashboard')
            return true
        } catch (err) {
            console.error('Login Admin gagal:', err.response?.data || err.message);
            error.value = err.response?.data?.message || 'Login Admin gagal. Silakan periksa kredensial Anda.';
            return false
        } finally {
            loading.value = false;
        }
    }

    // Fungsi untuk Registrasi User BARU
    async function register(userData) {
        loading.value = true;
        error.value = null;
        try {
            const response = await axiosClient.post('/register', userData);
            const data = response.data.data;

            // Setelah registrasi berhasil, langsung login user
            setAuthData(data.user, data.token, data.user.role.value === 'admin');
            router.push('/'); // Redirect ke halaman utama setelah register & login
            return true;
        } catch (err) {
            console.error('Registrasi gagal:', err.response?.data || err.message);
            // Tangkap pesan error dari backend
            if (err.response && err.response.data && err.response.data.errors) {
                // Jika ada error validasi Laravel (misal email sudah terdaftar, password kurang kuat)
                const validationErrors = Object.values(err.response.data.errors).flat();
                error.value = validationErrors.join('; ');
            } else {
                error.value = err.response?.data?.message || 'Registrasi gagal. Mohon coba lagi.';
            }
            return false;
        } finally {
            loading.value = false;
        }
    }

    async function logout() {
        loading.value = true;
        error.value = null;
        try {
            await axiosClient.post('/logout');
            console.log('Logout backend berhasil.');
        } catch (err) {
            console.error('Error saat logout backend:', err.response?.data || err.message);
            error.value = 'Logout gagal di backend. Harap coba lagi.';
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isAdminLoggedIn');
            user.value = null;
            token.value = null;
            isAuthenticated.value = false;
            isAdmin.value = false;
            router.push('/login');
            loading.value = false;
        }
    }

    async function fetchUser() {
        if (isAuthenticated.value && !loading.value) {
            loading.value = true;
            try {
                const response = await axiosClient.get('/me');
                user.value = response.data;
                isAdmin.value = user.value.role.value === 'admin';
                localStorage.setItem('user', JSON.stringify(user.value));
                localStorage.setItem('isAdminLoggedIn', isAdmin.value ? 'true' : 'false');
            } catch (err) {
                console.error('Gagal mengambil data pengguna:', err);
                if (err.response && err.response.status === 401) {
                    logout();
                }
                error.value = 'Gagal mengambil data pengguna.';
            } finally {
                loading.value = false;
            }
        }
    }

    return {
        user,
        token,
        isAuthenticated,
        isAdmin,
        error,
        loading,
        login,
        adminLogin,
        register, // <--- EXPORT FUNGSI REGISTER BARU
        logout,
        fetchUser,
    }
})