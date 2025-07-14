// src/stores/teamStore.js
import { defineStore } from 'pinia';
import axiosClient from '@/axios'; // Pastikan path ini benar ke Axios instance Anda

const STORAGE_KEY = 'santapin_team_members'; // Kunci untuk localStorage cache

export const useTeamStore = defineStore('team', {
    state: () => {
        return {
            teamMembers: [], // Data utama akan diambil dari backend
            loading: false,  // Indikator loading
            error: null,     // Pesan error
        }
    },
    actions: {
        /**
         * Mengambil data anggota tim dari backend Laravel.
         * Jika gagal, akan mencoba memuat dari localStorage sebagai fallback.
         */
        async fetchTeamMembers() {
            this.loading = true;
            this.error = null;
            try {
                // Selalu coba ambil data terbaru dari backend terlebih dahulu
                const response = await axiosClient.get('/members');
                this.teamMembers = response.data;
                // Simpan ke localStorage sebagai cache setelah berhasil fetch dari backend
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.teamMembers));
                console.log('Team members loaded from backend and cached.');
            } catch (err) {
                // Jika gagal fetch dari backend
                this.error = 'Gagal memuat data tim dari server: ' + (err.response?.data?.message || err.message);
                console.error('Error fetching team members from backend:', err);

                // Coba muat dari localStorage (sebagai fallback)
                const savedTeam = localStorage.getItem(STORAGE_KEY);
                if (savedTeam) {
                    this.teamMembers = JSON.parse(savedTeam);
                    this.error += '\n(Memuat data dari cache lokal.)'; // Tambahkan info ke pengguna
                    console.log('Team members loaded from localStorage cache due to backend error.');
                } else {
                    // Jika tidak ada di backend maupun cache, gunakan data statis sebagai initial fallback
                    const initialTeam = [
                        { id: 1, name: 'Egidius Dicky Narendra Baas', role: ['Team Leader'], task: ['Mengkoordinasikan tim', 'Arsitektur proyek.'], image: 'https://avatars.githubusercontent.com/u/162414603?v=4', github: 'https://github.com/egidiusdicky' },
                        { id: 2, name: 'Rayan', role: ['Frontend Developer'], task: ['Mengembangkan antarmuka pengguna', 'Pengalaman interaktif.'], image: 'https://avatars.githubusercontent.com/u/87006289?v=4', github: 'https://github.com/rayanbersabal' },
                        { id: 3, name: 'Garda Fitrananda', role: ['Frontend Developer'], task: ['Implementasi desain', 'Memastikan responsivitas.'], image: 'https://avatars.githubusercontent.com/u/202229964?v=4', github: 'https://github.com/gardafitrananda' },
                        { id: 4, name: 'Sauzana', role: ['Frontend Developer'], task: ['Manajemen state', 'Integrasi komponen.'], image: 'https://avatars.githubusercontent.com/u/202231744?v=4', github: 'https://github.com/Sauzana1919' },
                        { id: 5, name: 'Sandi Setiawan', role: ['Frontend Developer'], task: ['Optimasi performa', 'Fungsionalitas UI.'], image: 'https://avatars.githubusercontent.com/u/193219383?v=4', github: 'https://github.com/SandiSetiawann' },
                        { id: 6, name: 'Fahrudiansyah', role: ['Frontend Developer'], task: ['Membangun komponen UI yang reusable', 'Logika.'], image: 'https://avatars.githubusercontent.com/u/202230345?v=4', github: 'https://github.com/Fahrudiyansah' },
                    ];
                    this.teamMembers = initialTeam; // Gunakan data statis ini sebagai initial fallback
                    this.error += '\n(Memuat data contoh karena server dan cache tidak tersedia.)';
                    console.warn('No team members available from backend or local cache, using initial static data.');
                }
            } finally {
                this.loading = false;
            }
        },

        /**
         * Menambah anggota tim baru ke backend Laravel.
         * Setelah berhasil, akan memuat ulang data tim dari server.
         */
        async addTeamMember(member) {
            this.loading = true;
            this.error = null;
            try {
                // Perhatikan: endpoint ini adalah /admin/members karena hanya admin yang bisa menambah
                const response = await axiosClient.post('/admin/members', member);
                // Setelah berhasil, panggil ulang fetch untuk mendapatkan data terbaru dari server
                await this.fetchTeamMembers();
                return response.data;
            } catch (err) {
                this.error = 'Gagal menambah anggota tim: ' + (err.response?.data?.message || err.message);
                console.error('Error adding team member:', err.response?.data || err.message);
                throw err; // Lempar error agar komponen pemanggil bisa menanganinya
            } finally {
                this.loading = false;
            }
        },

        /**
         * Memperbarui anggota tim yang sudah ada di backend Laravel.
         * Setelah berhasil, akan memuat ulang data tim dari server.
         */
        async updateTeamMember(updatedMember) {
            this.loading = true;
            this.error = null;
            try {
                // Perhatikan: endpoint ini adalah /admin/members/{id} karena hanya admin yang bisa memperbarui
                const response = await axiosClient.put(`/admin/members/${updatedMember.id}`, updatedMember);
                // Setelah berhasil, panggil ulang fetch untuk mendapatkan data terbaru dari server
                await this.fetchTeamMembers();
                return response.data;
            } catch (err) {
                this.error = 'Gagal memperbarui anggota tim: ' + (err.response?.data?.message || err.message);
                console.error('Error updating team member:', err.response?.data || err.message);
                throw err; // Lempar error agar komponen pemanggil bisa menanganinya
            } finally {
                this.loading = false;
            }
        },

        /**
         * Menghapus anggota tim dari backend Laravel.
         * Setelah berhasil, akan memuat ulang data tim dari server.
         */
        async deleteTeamMember(memberId) {
            this.loading = true;
            this.error = null;
            try {
                // Perhatikan: endpoint ini adalah /admin/members/{id} karena hanya admin yang bisa menghapus
                await axiosClient.delete(`/admin/members/${memberId}`);
                // Setelah berhasil, panggil ulang fetch untuk mendapatkan data terbaru dari server
                await this.fetchTeamMembers();
            } catch (err) {
                this.error = 'Gagal menghapus anggota tim: ' + (err.response?.data?.message || err.message);
                console.error('Error deleting team member:', err.response?.data || err.message);
                throw err; // Lempar error agar komponen pemanggil bisa menanganinya
            } finally {
                this.loading = false;
            }
        }
    }
});