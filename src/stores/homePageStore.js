import { defineStore } from 'pinia'

const STORAGE_KEY = 'santapin_home_page_content';

export const useHomePageStore = defineStore('homePage', {
  state: () => {
    const savedContent = localStorage.getItem(STORAGE_KEY);
    
    // Data awal diambil dari kode Home.vue Anda
    const initialContent = {
      hero: {
        title: 'Seperti rasa yang pernah ada',
        subtitle: 'Nikmati hidangan autentik Indonesia yang dibuat dengan cinta dan bahan-bahan berkualitas terbaik.',
        backgroundImage: '/asset/bg1.webp'
      },
      whyUs: {
        title: 'Kenapa Santapin?',
        features: [
          {
            title: 'Bahan Lokal',
            description: 'Kami menggunakan bahan-bahan segar dari petani lokal untuk mendukung ekonomi daerah.'
          },
          {
            title: 'Rasa Tradisional',
            description: 'Setiap hidangan diolah dengan resep warisan yang telah diwariskan dari generasi ke generasi.'
          },
          {
            title: 'Harga Bersahabat',
            description: 'Kami menawarkan pengalaman kuliner berkualitas dengan harga yang terjangkau.'
          }
        ]
      }
    };

    return {
      content: savedContent ? JSON.parse(savedContent) : initialContent
    }
  },
  actions: {
    fetchContent() {
      console.log('Home page content loaded from state/localStorage.');
    },
    updateContent(newContent) {
      this.content = newContent;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.content));
      alert('Konten Halaman Utama berhasil diperbarui!');
    }
  }
})