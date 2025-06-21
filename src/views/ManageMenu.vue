<script setup>
import { ref, onMounted } from 'vue'
import axiosClient from '@/axios'
import ProductForm from '@/views/ProductForm.vue'

const products = ref([])
const loading = ref(true)
const error = ref(null)

const showForm = ref(false)
const selectedProduct = ref(null)

const fetchProducts = async () => {
  try {
    loading.value = true
    const response = await axiosClient.get('/products')
    products.value = response.data.data
  } catch (err) {
    error.value = 'Gagal memuat data produk.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)

const deleteProduct = async (id) => {
  if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) return

  try {
    await axiosClient.delete(`/admin/products/${id}`)
    products.value = products.value.filter(product => product.id !== id)
  } catch (err) {
    alert('Gagal menghapus produk.')
    console.error(err)
  }
}

const openAddForm = () => {
  selectedProduct.value = null
  showForm.value = true
}

const openEditForm = (product) => {
  selectedProduct.value = product
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  selectedProduct.value = null
}

const handleSaved = async () => {
  await fetchProducts()
  closeForm()
}
</script>

<template>
  <div class="p-6 bg-white text-[#5B3A29]">
    <h1 class="text-2xl font-bold mb-4">Kelola Menu</h1>

    <button @click="openAddForm" class="mb-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
      + Tambah Menu Baru
    </button>

    <div v-if="loading" class="text-gray-500">Memuat...</div>
    <div v-if="error" class="text-red-500">{{ error }}</div>

    <table v-if="products.length" class="w-full border border-collapse">
      <thead class="bg-gray-100 text-left">
        <tr>
          <th class="p-2 border">Gambar</th>
          <th class="p-2 border">Nama</th>
          <th class="p-2 border">Deskripsi</th>
          <th class="p-2 border">Harga</th>
          <th class="p-2 border">Kategori</th>
          <th class="p-2 border">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td class="p-2 border">
            <img :src="`http://localhost:8000/storage/${product.image}`" alt="foto" class="w-20 h-16 object-cover" />
          </td>
          <td class="p-2 border">{{ product.name }}</td>
          <td class="p-2 border">{{ product.description }}</td>
          <td class="p-2 border">Rp{{ product.price }}</td>
          <td class="p-2 border">{{ product.category }}</td>
          <td class="p-2 border space-x-2">
            <button @click="openEditForm(product)" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Edit</button>
            <button @click="deleteProduct(product.id)" class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else-if="!loading" class="text-gray-500">Belum ada produk.</div>

    <!-- Product Form Modal -->
    <ProductForm
      v-if="showForm"
      :product="selectedProduct"
      @close="closeForm"
      @saved="handleSaved"
    />
  </div>
</template>
