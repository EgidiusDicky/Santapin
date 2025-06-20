/*import { defineStore } from 'pinia'

export const useContactStore = defineStore('contact', {
  state: () => ({
    contactInfo: {
      address: 'Jl. Raya Kuliner No. 123, Jakarta, Indonesia',
      phone: '0812-3456-7890',
      email: 'contact@santapin.com'
    }
  }),
  actions: {
    // Aksi untuk mengambil data kontak dari backend
    async fetchContactInfo() {
      // Di aplikasi nyata, Anda akan memanggil API untuk mendapatkan data kontak.
      // Contoh: const response = await fetch('/api/contact');
      // this.contactInfo = await response.json();
      console.log('Fetching contact info...');
    },

    // Aksi untuk memperbarui data kontak
    async updateContactInfo(newInfo) {
      this.contactInfo = { ...newInfo };
      alert('Informasi kontak berhasil diperbarui!');
      // Di aplikasi nyata, Anda akan mengirim data ini ke API untuk disimpan.
      // Contoh: await fetch('/api/contact', { method: 'PUT', body: JSON.stringify(newInfo) });
    }
  }
})*/
import { defineStore } from 'pinia'

// 1. Definisikan kunci unik untuk localStorage
const STORAGE_KEY = 'santapin_footer_info';

export const useInfoStore = defineStore('info', {
  // 2. Ubah 'state' menjadi fungsi yang membaca dari localStorage
  state: () => {
    const savedInfo = localStorage.getItem(STORAGE_KEY);
    
    // Data awal jika localStorage kosong
    const initialInfo = {
      address: 'Jl. Raya Kuliner No. 123, Jakarta, Indonesia',
      phone: '0812-3456-7890',
      email: 'contact@santapin.com'
    };

    return {
      // Jika ada data tersimpan, gunakan itu. Jika tidak, gunakan data awal.
      footerInfo: savedInfo ? JSON.parse(savedInfo) : initialInfo
    }
  },
  actions: {
    fetchInfo() {
      // Tidak perlu melakukan apa-apa karena state sudah di-load dari localStorage
      console.log('Footer info loaded from state/localStorage.');
    },

    updateInfo(newInfo) {
      this.footerInfo = { ...newInfo };
      
      // 3. Simpan state baru ke localStorage setelah UPDATE
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.footerInfo));

      alert('Informasi footer berhasil diperbarui!');
    }
  }
})