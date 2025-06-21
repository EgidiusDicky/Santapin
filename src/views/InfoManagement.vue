<script setup>
import { ref, onMounted, watch } from 'vue';
// Impor store yang baru
import { useInfoStore } from '../stores/infoStore';

// Gunakan store yang baru
const infoStore = useInfoStore();

const form = ref({ address: '', phone: '', email: '' });

function handleUpdateInfo() {
  // Panggil aksi yang baru
  infoStore.updateInfo(form.value);
}

onMounted(() => {
  // Panggil aksi yang baru
  infoStore.fetchInfo();
  form.value = { ...infoStore.footerInfo };
});

watch(() => infoStore.footerInfo, (newInfo) => {
  form.value = { ...newInfo };
}, { deep: true });
</script>

<template>
  <div class="p-6 md:p-8">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Pengaturan Informasi Footer</h1>
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-xl font-semibold mb-4">Form Manajemen Info</h2>
      <form @submit.prevent="handleUpdateInfo">
        <div class="mb-4">
          <label for="address" class="block text-gray-700 font-medium mb-2">Alamat</label>
          <textarea id="address" v-model="form.address" rows="4" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#814C3C]"></textarea>
        </div>
        <div class="mb-4">
          <label for="phone" class="block text-gray-700 font-medium mb-2">Nomor Telepon</label>
          <input type="tel" id="phone" v-model="form.phone" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#814C3C]">
        </div>
        <div class="mb-6">
          <label for="email" class="block text-gray-700 font-medium mb-2">Alamat Email</label>
          <input type="email" id="email" v-model="form.email" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#814C3C]">
        </div>
        <button type="submit" class="bg-[#3D5943] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#314737] transition w-full md:w-auto">
          Simpan 
        </button>
      </form>
    </div>
  </div>
</template>