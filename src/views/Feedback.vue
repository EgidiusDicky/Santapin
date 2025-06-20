<script setup>
import { onMounted, computed } from 'vue';
import { useFeedbackStore } from '../stores/feedbackStore';

const feedbackStore = useFeedbackStore();

onMounted(() => {
  feedbackStore.fetchMessages();
});

// Kita gunakan 'computed' untuk memisahkan pesan secara otomatis
// Setiap kali 'messages' di store berubah, kedua variabel ini akan update
const contactMessages = computed(() => 
  feedbackStore.messages.filter(item => item.type === 'contact')
);

const ratingMessages = computed(() => 
  feedbackStore.messages.filter(item => item.type === 'rating')
);


// Fungsi helper untuk format tanggal (tetap sama)
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
}
</script>

<template>
  <div class="p-6">
    <h2 class="text-3xl font-bold mb-8 text-gray-800">Feedback & Pesan Masuk</h2>

    <section>
      <h3 class="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Pesan Kontak Masuk</h3>
      
      <div v-if="contactMessages.length === 0" class="text-gray-500 italic mb-4">
        Belum ada pesan kontak yang masuk.
      </div>

      <div v-else class="space-y-4">
        <div v-for="item in contactMessages" :key="item.id" class="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500">
          <div class="flex justify-between items-start">
            <p class="font-bold text-lg">{{ item.name }}</p>
            <span class="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Pesan Kontak</span>
          </div>
          <p class="text-sm text-gray-500 mb-2">{{ item.email }}</p>
          <p class="text-gray-700 my-2">"{{ item.message }}"</p>
          <p class="text-xs text-gray-400 text-right mt-2">{{ formatDate(item.date) }}</p>
        </div>
      </div>
    </section>

    <hr class="my-10">

    <section>
      <h3 class="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Feedback Rating</h3>

      <div v-if="ratingMessages.length === 0" class="text-gray-500 italic mb-4">
        Belum ada feedback rating yang masuk.
      </div>
      
      <div v-else class="space-y-4">
        <div v-for="item in ratingMessages" :key="item.id" class="bg-white p-4 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div class="flex justify-between items-start">
              <p class="font-bold text-lg">{{ item.name }}</p>
              <span class="text-xs font-semibold bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Rating</span>
            </div>
            <p class="text-gray-700 my-2">"{{ item.message }}"</p>
            <p class="text-yellow-500 font-medium">Rating: {{ item.rating }}/5</p>
            <p class="text-xs text-gray-400 text-right mt-2">{{ formatDate(item.date) }}</p>
        </div>
      </div>
    </section>

  </div>
</template>