<script setup>
import { ref } from 'vue';
import { useFeedbackStore } from '../stores/feedbackStore';

const emit = defineEmits(['close']);

const feedbackStore = useFeedbackStore();

const formData = ref({ name: '', email: '', message: '' });
const isLoading = ref(false);
const successMessage = ref('');

async function handleSubmit() {
  if (!formData.value.name || !formData.value.email || !formData.value.message) {
    alert('Mohon lengkapi semua field.');
    return;
  }
  isLoading.value = true;
  const result = await feedbackStore.submitContactMessage(formData.value);
  isLoading.value = false;

  if (result.success) {
    successMessage.value = 'Pesan Anda berhasil terkirim. Terima kasih!';
    formData.value = { name: '', email: '', message: '' }; // Reset form
    setTimeout(() => {
      emit('close'); // Tutup modal setelah 2 detik
    }, 2000);
  }
}
</script>

<template>
  <div @click.self="emit('close')" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 flex justify-center items-center p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
      <button @click="emit('close')" class="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
      
      <h3 class="text-2xl font-bold text-gray-800 mb-4">Hubungi Kami</h3>

      <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        {{ successMessage }}
      </div>

      <form v-else @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="name" class="block text-gray-700 text-sm font-bold mb-2">Nama</label>
          <input v-model="formData.name" type="text" id="name" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#814C3C]">
        </div>
        <div class="mb-4">
          <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input v-model="formData.email" type="email" id="email" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#814C3C]">
        </div>
        <div class="mb-4">
          <label for="message" class="block text-gray-700 text-sm font-bold mb-2">Pesan</label>
          <textarea v-model="formData.message" id="message" rows="4" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#814C3C]"></textarea>
        </div>
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-[#814C3C] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#6d3e31] transition disabled:bg-gray-400"
        >
          {{ isLoading ? 'Mengirim...' : 'Kirim Pesan' }}
        </button>
      </form>
    </div>
  </div>
</template>