import { defineStore } from 'pinia'

const STORAGE_KEY = 'santapin_about_page_content';

export const useAboutPageStore = defineStore('aboutPage', {
  state: () => {
    const savedContent = localStorage.getItem(STORAGE_KEY);
    
    // Data awal diambil dari kode About.vue Anda
    const initialContent = {
      heroTitle: 'Tentang Santapin',
      heroSubtitle: 'Menghubungkan cita rasa tradisional Indonesia dengan kemudahan teknologi modern untuk pengalaman kuliner yang tak terlupakan.',
      heroImage: '/asset/Bangunan_restoran.jpeg',

      aboutTitle: 'Tentang Kami',
      aboutParagraphs: [
        'Santapin adalah platform kuliner yang lahir dari kecintaan mendalam terhadap kekayaan cita rasa Indonesia. Kami percaya bahwa setiap hidangan memiliki cerita, dan setiap gigitan adalah perjalanan menuju warisan budaya yang kaya.',
        'Dengan menggabungkan resep tradisional yang telah diwariskan turun-temurun dengan inovasi kuliner modern, kami menghadirkan pengalaman makan yang autentik namun tetap relevan dengan gaya hidup masa kini.',
        'Dari nasi goreng spesial hingga rendang yang kaya rempah, setiap menu di Santapin dibuat dengan penuh cinta dan dedikasi untuk memberikan yang terbaik bagi pelanggan kami.'
      ],
      aboutImage: '/asset/Makanan.jpeg',

      visionTitle: 'Visi',
      visionText: 'Menjadi platform kuliner terdepan yang melestarikan dan memperkenalkan kekayaan cita rasa Indonesia kepada dunia, sambil mendukung ekonomi lokal dan keberlanjutan lingkungan.',
      
      missionTitle: 'Misi',
      missionPoints: [
        'Menyajikan hidangan Indonesia autentik dengan kualitas terbaik',
        'Mendukung petani dan produsen lokal Indonesia',
        'Memberikan pengalaman kuliner yang mudah dan menyenangkan',
        'Melestarikan warisan kuliner nusantara untuk generasi mendatang'
      ],
      
      //galleryMainImage: '/asset/Dapur.jpeg',
        gallery: [
        { src: '/asset/Dapur.jpeg', title: 'Behind the Scenes Kitchen' },
        { src: '/asset/Bumbu.jpeg', title: 'Rempah Asli Indonesia' },
        { src: '/asset/Chef.jpeg', title: 'Chef Profesional Kami' },
        { src: '/asset/Makanan.jpeg', title: 'Sajian Penuh Cinta' }
      ]
    };

    return {
      content: savedContent ? JSON.parse(savedContent) : initialContent
    }
  },
  actions: {
    fetchContent() {
      console.log('About page content loaded from state/localStorage.');
    },
    updateContent(newContent) {
      // Untuk paragraf dan misi, kita simpan sebagai satu string panjang,
      // lalu kita proses saat menyimpan dan menampilkan.
      this.content = newContent;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.content));
      alert('Konten halaman "About Us" berhasil diperbarui!');
    }
  }
})