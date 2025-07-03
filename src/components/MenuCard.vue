<script setup>
import { useCartStore } from '@/stores/cartStore'
import { computed } from 'vue'; // <--- ADD THIS LINE if not already there
//import { defineProps, defineEmits } from 'vue'; // Pastikan ini diimpor jika belum ada

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  // Tambahkan prop 'index' untuk menentukan loading strategy
  index: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['add-to-cart']);

const cart = useCartStore();
// --- ADD THIS NEW LINE ---
const imageBaseUrl = import.meta.env.VITE_APP_IMAGE_URL;
// You could also make it a computed property if you need reactivity, but for a static env var, a const is fine.
// const imageBaseUrl = computed(() => import.meta.env.VITE_APP_IMAGE_URL);


// Fungsi untuk menentukan loading strategy (eager vs lazy)
// Berdasarkan index item. Sesuaikan angka '4' dengan jumlah kolom grid Anda
// atau berapa banyak item yang diharapkan terlihat di viewport awal (misal: 4 untuk desktop, 2 untuk mobile).
// Jika grid Anda 4 kolom, maka 4 item pertama akan eager.
const getLoadingStrategy = (index) => {
  // Anda bisa sesuaikan angka '4' ini. Misalnya, jika Anda hanya menampilkan 3 kolom, bisa 3.
  // Atau lebih konservatif 6-8 jika Anda ingin memastikan semua di baris pertama eager
  return index < 4 ? 'eager' : 'lazy';
};

// Fungsi untuk menentukan fetchpriority
const getFetchPriority = (index) => {
  return index < 4 ? 'high' : 'auto';
};
</script>

<template>
  <div class="min-h-[380px] bg-white rounded-lg p-4 flex flex-col shadow-lg">
    <router-link :to="`/menu/${item.id}`" class="mb-4">
      <div
        class="w-full h-40 bg-gray-200 rounded-md flex justify-center items-center overflow-hidden"
      >
        <img
          v-if="item.image"
          :loading="getLoadingStrategy(props.index)" :fetchpriority="getFetchPriority(props.index)" :src="`${imageBaseUrl}/${item.image}`"
          :alt="item.name"
          class="w-full h-full object-cover rounded-md text-black"
          width="300"
          height="160"
        />
        <span v-else class="text-gray-500 text-lg">No Image</span>
      </div>

      <h2 class="text-xl text-black font-semibold mt-2">{{ item.name }}</h2>
      <p class="text-sm text-black mt-1 line-clamp-3">{{ item.description }}</p>
    </router-link>

    <div class="mt-auto pt-4">
      <span class="text-lg font-bold text-[#814C3C] block mb-2">
        Rp{{ item.price ? item.price.toLocaleString('id-ID') : '0' }} </span>
      <button
        class="bg-[#814C3C] text-white w-full py-2 rounded hover:bg-[#3d5943] transition-colors"
        :aria-label="`Tambah ${item.name} ke keranjang`"
        @click="emit('add-to-cart', { ...item, quantity: 1 })"
      >
        Tambah ke keranjang
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Pastikan Anda memiliki definisi line-clamp-3 di sini atau di CSS global */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>