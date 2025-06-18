// src/stores/authStore.js
import { defineStore } from 'pinia';
import axiosClient from '@/axios'; // Pastikan ini diimpor
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    const token = ref(localStorage.getItem('token') || null);
    const user = ref(JSON.parse(localStorage.getItem('user')) || null);
    const loading = ref(false);
    const error = ref(null);

    const router = useRouter();

    const isAuthenticated = computed(() => !!token.value);
    const isAdmin = computed(() => user.value && user.value.role === 'admin');

    async function fetchUser() {
        if (!token.value) {
            user.value = null;
            return;
        }
        try {
            // Hapus header Authorization yang eksplisit di sini. Interceptor di axios.js sudah menangani.
            const response = await axiosClient.get('/me'); // <-- UBAH INI
            user.value = response.data;
            if (user.value.role === 'admin') {
                localStorage.setItem('isAdminLoggedIn', 'true');
            } else {
                localStorage.setItem('isAdminLoggedIn', 'false');
            }
        } catch (err) {
            console.error('Failed to fetch user, logging out:', err);
            await logout();
        }
    }

    async function login({ email, password, isAdmin = false }) {
        loading.value = true;
        error.value = null;

        try {
            const url = isAdmin
                ? '/admin-login' // BaseURL sudah ditangani oleh axiosClient
                : '/login';

            const response = await axiosClient.post(url, { email, password }); // <-- Menggunakan axiosClient

            token.value = response.data.token;
            user.value = response.data.user;

            localStorage.setItem('token', token.value);
            localStorage.setItem('user', JSON.stringify(user.value));

            if (isAdmin && user.value && user.value.role === 'admin') {
                console.log('Admin login successful. Attempting redirect to AdminDashboard.');
                router.push({ name: 'AdminDashboard' });
                localStorage.setItem('isAdminLoggedIn', 'true');
            } else if (!isAdmin && user.value && user.value.role === 'user') {
                console.log('User login successful. Redirecting to Home.');
                router.push({ name: 'Home' });
                localStorage.setItem('isAdminLoggedIn', 'false');
            } else {
                console.warn('Login sukses, tetapi role user tidak sesuai ekspektasi:', user.value?.role);
                error.value = 'Akses ditolak: Peran pengguna tidak valid.';
                await logout();
            }

        } catch (err) {
            token.value = null;
            user.value = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isAdminLoggedIn');
            error.value = err.response ? err.response.data.message : 'Terjadi kesalahan jaringan atau server.';
            console.error('Login error:', err.response || err);
        } finally {
            loading.value = false;
        }
    }

    async function logout() {
        if (!token.value) return;
        try {
            // Hapus header Authorization yang eksplisit di sini. Interceptor di axios.js sudah menangani.
            await axiosClient.post('/logout'); // <-- UBAH INI
        } catch (err) {
            console.error('Logout failed (client-side or server-side issue):', err);
        } finally {
            token.value = null;
            user.value = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isAdminLoggedIn');
            console.log('Frontend state cleared and localStorage removed after logout.');
            router.push('/login');
        }
    }

    return {
        token,
        user,
        loading,
        error,
        isAuthenticated,
        isAdmin,
        login,
        logout,
        fetchUser
    };
});