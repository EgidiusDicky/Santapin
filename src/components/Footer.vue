<script setup>
import { ref, onMounted } from 'vue';
// Pastikan path ini benar sesuai struktur folder Anda
import { useInfoStore } from '../stores/infoStore';
import ContactModal from './ContactModal.vue';

// Logika untuk menampilkan info kontak dari infoStore
const infoStore = useInfoStore();
onMounted(() => {
  infoStore.fetchInfo();
});

// State untuk mengontrol visibilitas modal
const isModalOpen = ref(false);
</script>

<template>
  <footer class="bg-[#3D5943] text-[#D9D9D9] text-xs md:text-sm py-8 mt-auto">
    <div class="max-w-6xl mx-auto px-6 flex flex-col md:flex-row flex-wrap md:justify-between gap-8 md:gap-0">

      <section class="w-full md:w-1/4 text-left px-4">
        <h4 class="font-semibold mb-2">Info</h4>
        <div class="not-italic leading-relaxed space-y-1" v-if="infoStore.footerInfo">
            <div>{{ infoStore.footerInfo.address }}</div>
            <div>Tel: {{ infoStore.footerInfo.phone }}</div>
            <div>Email: {{ infoStore.footerInfo.email }}</div>
        </div>
      </section>

      <section class="w-full md:w-1/4 text-left md:text-center px-4">
        <h4 class="font-semibold mb-2">Jam Operasional</h4>
        <p>Senin - Minggu</p>
        <p>10:00 - 22:00</p>
      </section>

      <section class="w-full md:w-1/4 text-left md:text-center px-4">
        <h4 class="font-semibold mb-2">Tentang Kami</h4>
        <router-link to="/about" class="hover:underline hover:text-white transition">
          Lihat profil tim kami
        </router-link>
      </section>

      <section class="w-full md:w-1/4 text-left md:text-right px-4">
        <h4 class="font-semibold mb-2">Contact Us</h4>
        <button @click="isModalOpen = true" class="text-[#D9D9D9] hover:text-white hover:underline transition">
          Kirim Pesan
        </button>
      </section>
      
    </div>

    <div class="mt-6 text-center text-xs text-[#D9D9D9]/70">
      &copy; 2025 Santapin. All rights reserved.
    </div>
  </footer>

  <ContactModal v-if="isModalOpen" @close="isModalOpen = false" />
</template>