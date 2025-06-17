// src/stores/authStore.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { ref, computed } from 'vue'; // Pastikan computed di-import jika Anda menggunakannya
import { useRouter } from 'vue-router'; // Penting: Import useRouter

// Asumsi Anda memiliki Role Enum atau string literal 'admin' dan 'user'
// Jika Anda punya Role.ADMIN, pastikan Role di-import
// import { Role } from '@/enums/Role'; 

export const useAuthStore = defineStore('auth', () => {
    // States reaktif
    const token = ref(localStorage.getItem('token') || null);
    const user = ref(JSON.parse(localStorage.getItem('user')) || null);
    const loading = ref(false); // Untuk status loading button
    const error = ref(null);    // Untuk pesan error

    // Inisialisasi router di dalam setup function Pinia
    const router = useRouter(); 

    // Getter (opsional, tapi berguna untuk memeriksa status login atau role)
    const isAuthenticated = computed(() => !!token.value);
    const isAdmin = computed(() => user.value && user.value.role === 'admin'); // Sesuaikan 'admin' jika beda

    // Metode untuk fetch user (sering dipanggil saat aplikasi dimuat ulang)
    async function fetchUser() {
        if (!token.value) {
            user.value = null;
            return;
        }
        try {
            // Pastikan Anda mengirim token di header (misal via Axios interceptor atau di sini)
            const response = await axios.get('http://localhost:8000/api/me', {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            });
            user.value = response.data;
            // Jika fetch user berhasil, pastikan isAdminLoggedIn juga disetel
            if (user.value.role === 'admin') { // Sesuaikan 'admin' dengan nilai role admin Anda
                localStorage.setItem('isAdminLoggedIn', 'true');
            } else {
                localStorage.setItem('isAdminLoggedIn', 'false');
            }
        } catch (err) {
            console.error('Failed to fetch user, logging out:', err);
            // Hapus token dan user jika fetching gagal (misal token expired/invalid)
            await logout(); 
        }
    }

    // Metode Login
    async function login({ email, password, isAdmin = false }) {
        loading.value = true;
        error.value = null; // Bersihkan error sebelumnya

        try {
            // Tentukan URL API berdasarkan apakah ini login admin atau user biasa
            const url = isAdmin 
                ? 'http://localhost:8000/api/admin-login' // Pastikan ini cocok dengan routes/api.php
                : 'http://localhost:8000/api/login';      // Untuk user biasa
            
            const response = await axios.post(url, { email, password });
            
            // Simpan token dan data user dari respons
            token.value = response.data.token;
            user.value = response.data.user; 

            // Simpan ke localStorage untuk persistensi
            localStorage.setItem('token', token.value);
            localStorage.setItem('user', JSON.stringify(user.value));

            // Logika Redirect setelah Login Sukses
            if (isAdmin && user.value && user.value.role === 'admin') {
                console.log('Admin login successful. Attempting redirect to AdminDashboard.');
                // --- OPSI 1: REDIRECT MENGGUNAKAN NAMA RUTE ---
                router.push({ name: 'AdminDashboard' }); 
                // --- PENTING: Set status admin di localStorage untuk navigation guard ---
                localStorage.setItem('isAdminLoggedIn', 'true'); 
            } else if (!isAdmin && user.value && user.value.role === 'user') { // Contoh untuk user biasa
                console.log('User login successful. Redirecting to Home.');
                router.push({ name: 'Home' }); // Redirect ke halaman utama user biasa
                localStorage.setItem('isAdminLoggedIn', 'false'); // Pastikan ini false untuk user biasa
            } else {
                // Kasus ini bisa terjadi jika login sukses tapi role tidak sesuai harapan
                // Misalnya, admin mencoba login ke rute user, atau sebaliknya
                console.warn('Login sukses, tetapi role user tidak sesuai ekspektasi:', user.value?.role);
                // Mungkin langsung logout atau tampilkan pesan error yang lebih spesifik
                error.value = 'Akses ditolak: Peran pengguna tidak valid.';
                await logout(); // Logout jika role tidak sesuai
            }

        } catch (err) {
            // Penanganan error dari backend (misal 401 Unauthorized, 403 Forbidden, 500 Internal Server Error)
            token.value = null;
            user.value = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isAdminLoggedIn'); // Bersihkan juga flag admin
            error.value = err.response ? err.response.data.message : 'Terjadi kesalahan jaringan atau server.';
            console.error('Login error:', err.response || err);
            // Opsional: Redirect ke halaman login jika terjadi error signifikan
            // router.push(isAdmin ? '/admin-login' : '/login');
        } finally {
            loading.value = false; // Reset status loading
        }
    }

    // Metode Logout
    async function logout() {
        if (!token.value) return; // Tidak ada token, tidak perlu logout
        try {
            // Panggil API logout Laravel
            await axios.post('http://localhost:8000/api/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token.value}`
                }
            });
        } catch (err) {
            console.error('Logout failed (client-side or server-side issue):', err);
            // Tetap lanjutkan pembersihan state di frontend meskipun API logout gagal
        } finally {
            // Bersihkan semua state dan localStorage
            token.value = null;
            user.value = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isAdminLoggedIn');
            router.push('/login'); // Redirect ke halaman login setelah logout
        }
    }

    // Return semua state dan methods yang ingin diekspos
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