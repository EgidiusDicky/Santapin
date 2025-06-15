// stores/menuStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axiosClient from '@/axios'

export const useMenuStore = defineStore('menu', () => {
  const menuItems = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchMenuItems() {
    loading.value = true
    error.value = null
    try {
      const response = await axiosClient.get('/products')
      menuItems.value = response.data.data // assuming you're using a Resource or pagination
    } catch (err) {
      console.error('Gagal Memuat menu', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }
  

  function getItemById(id) {
    return menuItems.value.find(item => item.id === id)
  }

  return {
    menuItems,
    loading,
    error,
    fetchMenuItems,
    getItemById,
  }
})
