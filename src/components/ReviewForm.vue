<script setup>
import { ref } from 'vue'
import { useReviewStore } from '@/stores/reviewStore'
import { useNotificationStore } from '@/stores/notificationStore'

const props = defineProps({
  orderId: {
    type: Number,
    required: true
  },
  items: {
    type: Array,
    required: true
  }
})

// Log ini akan menunjukkan data setelah diperbaiki.
console.log('Data items yang diterima:', props.items);

const reviewStore = useReviewStore()
const notificationStore = useNotificationStore()

const reviewForms = ref(props.items.map(item => ({
  // Asumsi: Setelah perbaikan, data akan memiliki `product_id` atau `id`
  productId: item.product_id || item.id,
  name: item.name,
  rating: 0,
  comment: '',
  hasSubmitted: false
})))

const setRating = (reviewItem, star) => {
  reviewItem.rating = star;
}

const submitReview = async (reviewItem) => {
  // Pastikan ada productId sebelum mengirim
  if (!reviewItem.productId) {
    notificationStore.triggerPopup('Peringatan: ID produk tidak ditemukan. Tidak dapat mengirim ulasan.', 'error');
    return;
  }

  if (reviewItem.rating === 0 || !reviewItem.comment.trim()) {
    notificationStore.triggerPopup('Peringatan: Rating dan komentar tidak boleh kosong!', 'warning');
    return;
  }

  try {
    const reviewData = {
      orderId: props.orderId,
      productId: reviewItem.productId,
      rating: reviewItem.rating,
      comment: reviewItem.comment,
    };

    console.log('Mengirim data ulasan:', reviewData);

    await reviewStore.submitOrderReview(reviewData);

    reviewItem.hasSubmitted = true;
    notificationStore.triggerPopup('Terima kasih atas ulasan Anda!', 'success');
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    notificationStore.triggerPopup(`Gagal mengirim ulasan: ${errorMessage}`, 'error');
  }
}
</script>

<template>
  <div class="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
    <h3 class="text-base font-semibold mb-3">Beri ulasan untuk produk ini:</h3>
    
    <div v-for="item in reviewForms" :key="item.productId" class="mb-6 p-4 border border-gray-200 rounded-lg bg-white last:mb-0">
      <h4 class="font-bold text-gray-800 mb-2">{{ item.name }}</h4>

      <div v-if="item.hasSubmitted" class="text-center py-4 text-green-600">
        <p class="font-semibold">Terima kasih atas ulasan Anda!</p>
      </div>

      <div v-else>
        <div class="flex items-center mb-4">
          <span class="mr-2 text-sm text-gray-700">Rating:</span>
          <div class="flex space-x-1 text-2xl">
            <button
              v-for="star in 5"
              :key="star"
              @click="setRating(item, star)"
              :class="[
                'focus:outline-none',
                item.rating >= star ? 'text-yellow-400' : 'text-gray-300'
              ]"
              aria-label="star rating"
            >
              &#9733;
            </button>
          </div>
        </div>
        
        <div class="mb-4">
          <label :for="`reviewComment-${item.productId}`" class="block text-sm font-medium text-gray-700 mb-1">Komentar:</label>
          <textarea
            :id="`reviewComment-${item.productId}`"
            v-model="item.comment"
            rows="3"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#7A4A39] focus:border-[#7A4A39] transition"
            placeholder="Tulis ulasan Anda di sini..."
          ></textarea>
        </div>

        <button
          @click="submitReview(item)"
          class="w-full py-2 px-4 bg-[#7A4A39] text-white font-semibold rounded-md hover:bg-[#6a3e2f] transition"
        >
          Kirim Ulasan
        </button>
      </div>
    </div>
  </div>
</template>
