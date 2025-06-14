<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/axios'
import ProductForm from '../components/ProductForm.vue'

const products = ref([])
const showModal = ref(false)
const editingProduct = ref(null)

const fetchProducts = async () => {
  const res = await axios.get('/products')
  products.value = res.data
}

onMounted(fetchProducts)

const openModal = (product = null) => {
  editingProduct.value = product
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingProduct.value = null
}

const refreshList = async () => {
  await fetchProducts()
  closeModal()
}
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Manage Products</h1>
      <button @click="openModal()" class="bg-[#7A4A39] text-white px-4 py-2 rounded">+ Add Product</button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="product in products" :key="product.id" class="p-4 border rounded shadow-sm">
        <img :src="product.image" class="h-32 w-full object-cover rounded mb-2" />
        <h3 class="text-lg font-bold">{{ product.name }}</h3>
        <p class="text-sm">{{ product.description }}</p>
        <p class="mt-1">Rp. {{ product.price.toLocaleString() }}</p>
        <div class="mt-2 flex justify-between">
          <button @click="openModal(product)" class="text-blue-500">Edit</button>
        </div>
      </div>
    </div>

    <ProductForm v-if="showModal" :product="editingProduct" @close="closeModal" @saved="refreshList" />
  </div>
</template>
