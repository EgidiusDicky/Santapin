import { defineStore } from 'pinia'
import axiosClient from '@/axios' // Impor instance axiosClient yang sudah dikonfigurasi
import { ref } from 'vue'

export const useReviewStore = defineStore('review', () => {
  const reviews = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchReviewsForProduct = async (productId) => {
    loading.value = true
    error.value = null
    try {
      // Gunakan axiosClient yang sudah dikonfigurasi
      const response = await axiosClient.get(`/products/${productId}/reviews`) 
      reviews.value = response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal memuat ulasan.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const submitOrderReview = async (reviewData) => {
    try {
      // Gunakan axiosClient yang sudah dikonfigurasi
      const response = await axiosClient.post('/reviews', reviewData) 
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal mengirim ulasan.'
      console.error(err)
      throw new Error(error.value)
    }
  }

  return {
    reviews,
    loading,
    error,
    fetchReviewsForProduct,
    submitOrderReview
  }
})