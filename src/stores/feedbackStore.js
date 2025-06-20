import { defineStore } from 'pinia'

// Kunci unik untuk localStorage kita
const STORAGE_KEY = 'santapin_feedback_messages';

export const useFeedbackStore = defineStore('feedback', {
  state: () => {
    // Saat store pertama kali dimuat, coba ambil data dari localStorage
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    
    // Jika ada data di localStorage, gunakan itu. Jika tidak, gunakan data awal.
    const initialMessages = [
      { id: 1, type: 'rating', name: 'Budi', message: 'Makanannya enak!', rating: 5, date: '2025-06-19T10:00:00.000Z' },
      { id: 2, type: 'rating', name: 'Sari', message: 'Pengiriman cepat.', rating: 4, date: '2025-06-20T11:30:00.000Z' },
      { id: 3, type: 'rating', name: 'Andi', message: 'Pelayanan bagus.', rating: 5, date: '2025-06-20T12:00:00.000Z' },
    ];

    return {
      messages: savedMessages ? JSON.parse(savedMessages) : initialMessages
    }
  },
  actions: {
    async submitContactMessage(messageData) {
      const newMessage = {
        id: Date.now(),
        type: 'contact',
        name: messageData.name,
        email: messageData.email,
        message: messageData.message,
        date: new Date().toISOString()
      }
      this.messages.unshift(newMessage);
      
      // --- PERUBAHAN PENTING ---
      // Simpan seluruh array messages ke localStorage setiap kali ada pesan baru
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.messages));
      
      return { success: true };
    },

    fetchMessages() {
      // Sekarang aksi ini tidak perlu melakukan apa-apa karena state sudah
      // diinisialisasi dengan data dari localStorage.
      console.log('Messages loaded from state/localStorage.');
    }
  }
})