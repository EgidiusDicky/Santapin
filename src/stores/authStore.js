// src/stores/authStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue' // Import computed
import axiosClient from '@/axios'
import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
    // Muat user dan token dari localStorage saat store diinisialisasi
    const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))
    const token = ref(localStorage.getItem('token'))

    // Gunakan computed property untuk isAuthenticated dan isAdmin
    // Ini lebih reaktif dan selalu mencerminkan state 'user' dan 'token' saat ini
    const isAuthenticated = computed(() => !!token.value && !!user.value);
    // Asumsi: Backend mengirim role sebagai string, misal user.role = 'admin'
    const isAdmin = computed(() => isAuthenticated.value && user.value?.role === 'admin');

    const error = ref(null) // State untuk menyimpan pesan error
    const loading = ref(false) // State untuk indikator loading

    // Fungsi helper untuk mengatur semua data otentikasi
    function setAuthData(userData, authToken) { // Hapus isAdminUser, kita hitung dari userData.role
        user.value = userData
        token.value = authToken
        localStorage.setItem('user', JSON.stringify(userData))
        localStorage.setItem('token', authToken)
        // isAdmin.value akan otomatis terupdate via computed property
        // Hapus localStorage.setItem('isAdminLoggedIn') karena sudah dihitung dari user.role
    }

    // Fungsi untuk login biasa (user)
    async function login(credentials) {
        loading.value = true;
        error.value = null;
        try {
            const response = await axiosClient.post('/login', credentials)
            const data = response.data.data

            // Pastikan data.user dan data.token ada sebelum memanggil setAuthData
            if (!data || !data.user || !data.token) {
                throw new Error('Invalid response structure for user login.');
            }

            setAuthData(data.user, data.token) // data.user sudah punya 'role'
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

            // Pastikan data.user dan data.token ada
            if (!data || !data.user || !data.token) {
                throw new Error('Invalid response structure for admin login.');
            }

            // Periksa role secara langsung di sini sebelum setAuthData jika ingin lebih ketat
            if (data.user.role !== 'admin') {
                throw new Error('Akses ditolak. Anda bukan admin.');
            }

            setAuthData(data.user, data.token) // data.user sudah punya 'role: admin'
            router.push('/admin/dashboard')
            return true
        } catch (err) {
            console.error('Login Admin gagal:', err.response?.data || err.message);
            // Tangkap error kustom jika role bukan admin
            if (err.message === 'Akses ditolak. Anda bukan admin.') {
                error.value = err.message;
            } else {
                error.value = err.response?.data?.message || 'Login Admin gagal. Silakan periksa kredensial Anda.';
            }
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

            if (!data || !data.user || !data.token) {
                throw new Error('Invalid response structure for registration.');
            }

            setAuthData(data.user, data.token); // setAuthData akan mengatur isAdmin secara otomatis
            router.push('/');
            return true;
        } catch (err) {
            console.error('Registrasi gagal:', err.response?.data || err.message);
            if (err.response && err.response.data && err.response.data.errors) {
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
            // Ini mungkin terjadi jika token sudah kedaluwarsa di backend,
            // tapi kita tetap perlu membersihkan state frontend.
            error.value = 'Logout gagal di backend. Harap coba lagi.';
        } finally {
            // Selalu bersihkan state frontend dan localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Hapus ini: localStorage.removeItem('isAdminLoggedIn'); // Tidak diperlukan lagi
            user.value = null;
            token.value = null;
            // isAuthenticated dan isAdmin akan otomatis menjadi false karena computed property
            router.push('/login');
            loading.value = false;
        }
    }

    async function fetchUser() {
        // Hanya panggil jika ada token dan belum dalam kondisi loading
        if (token.value && !loading.value) {
            loading.value = true;
            error.value = null; // Reset error saat fetch user
            try {
                const response = await axiosClient.get('/me');
                // Pastikan response.data ada dan punya struktur yang benar
                if (!response.data) {
                    throw new Error('Invalid user data response.');
                }
                user.value = response.data; // Backend /me harus mengembalikan objek user
                localStorage.setItem('user', JSON.stringify(user.value));
                // token.value tidak perlu diperbarui karena sudah ada
                // isAdmin computed property akan otomatis mengikuti user.value.role
            } catch (err) {
                console.error('Gagal mengambil data pengguna:', err);
                if (err.response && err.response.status === 401) {
                    // Jika token tidak valid (401), logout secara paksa
                    console.log('Token tidak valid, melakukan logout paksa.');
                    logout();
                }
                error.value = err.response?.data?.message || 'Gagal mengambil data pengguna.';
            } finally {
                loading.value = false;
            }
        }
    }

    // Penting: Panggil fetchUser saat store pertama kali diinisialisasi
    // Ini memastikan state user terisi saat refresh jika ada token di localStorage
    fetchUser();

    return {
        user,
        token,
        isAuthenticated, // Ini sekarang computed property
        isAdmin,         // Ini sekarang computed property
        error,
        loading,
        login,
        adminLogin,
        register,
        logout,
        fetchUser,
    }
})