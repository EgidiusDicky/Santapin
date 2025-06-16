<script setup>
import { ref, watch } from 'vue'
import axiosClient from '@/axios'

const props = defineProps({ product: Object })
const emit = defineEmits(['close', 'saved'])

const form = ref({
  name: '',
  description: '',
  price: '',
  category: '',
  image: null,
})

const previewUrl = ref(null)
const isSaving = ref(false)
const error = ref(null)
const success = ref(null)

const categories = ['Makanan', 'Minuman']

const validateForm = () => {
  return form.value.name && form.value.description && form.value.price && form.value.category
}

watch(
  () => props.product,
  newVal => {
    if (newVal) {
      form.value = {
        name: newVal.name,
        description: newVal.description,
        price: newVal.price,
        category: newVal.category,
        image: null, // Keep this as null so users have to re-select if they want to change
      }
      // --- CORRECTED FIX FOR IMAGE PREVIEW ON EDIT ---
      if (newVal.image) {
        // If the stored image path is relative (e.g., 'products/xyz.jpg'), prepend '/storage/' and base URL.
        // If it's already a full URL (e.g., from an external CDN or already processed), use it as is.
        previewUrl.value = newVal.image.startsWith('http')
          ? newVal.image
          : `http://localhost:8000/storage/${newVal.image}`;
      } else {
        previewUrl.value = null; // No image for this product
      }
      // --- END CORRECTED FIX ---
    } else {
      // When adding a new product, reset form
      form.value = {
        name: '',
        description: '',
        price: '',
        category: '',
        image: null,
      }
      previewUrl.value = null
    }
    error.value = null
    success.value = null
  },
  { immediate: true }
)

const handleImage = e => {
  const file = e.target.files[0]
  if (file) { // Make sure a file was actually selected
    form.value.image = file
    previewUrl.value = URL.createObjectURL(file) // For new file, use Blob URL
  } else {
    form.value.image = null;
    previewUrl.value = null;
  }
}

const submit = async () => {
  error.value = null
  success.value = null

  if (!validateForm()) {
    error.value = 'Semua field wajib diisi.'
    return
  }

  const formData = new FormData()
  for (const key in form.value) {
    // Crucially, when updating, if no new image is selected, don't send the 'image' key
    // This prevents sending a 'null' file which might delete the existing image on backend
    if (key === 'image' && form.value[key] === null && props.product) {
        continue; // Skip appending 'image' if it's an update and no new image is chosen
    }
    if (form.value[key] !== null) { // Ensure other fields are not null when appending
      formData.append(key, form.value[key])
    }
  }

  // Ensure _method=PUT is always there for update, for consistency with Laravel's FormData handling
  if (props.product) {
      formData.append('_method', 'PUT');
  }

  isSaving.value = true // Set saving state before request

  try {
    let res
    if (props.product) {
      // For updates: POST request to specific product ID with _method=PUT in FormData
      res = await axiosClient.post(`/products/${props.product.id}`, formData)
    } else {
      // For new products: POST request to /products
      res = await axiosClient.post('/products', formData)
    }

    console.log('Saved successfully:', res.data)
    success.value = 'Produk berhasil disimpan.'
    emit('saved') // Notify parent component that data has been saved
  } catch (err) {
    console.error('Save failed:', err.response?.data || err.message)
    error.value = 'Gagal menyimpan produk.'
  } finally {
    isSaving.value = false; // Always reset saving state regardless of success or error
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black/10 flex items-center justify-center z-50 backdrop-blur-lg">
    <div class="bg-white p-6 rounded w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">{{ product ? 'Edit' : 'Tambah' }} Produk</h2>

      <div v-if="error" class="text-red-500 text-sm mb-2">{{ error }}</div>
      <div v-if="success" class="text-green-600 text-sm mb-2">{{ success }}</div>

      <div class="space-y-3">
        <input
          v-model="form.name"
          type="text"
          placeholder="Nama Produk"
          class="w-full border px-3 py-2 rounded"
        />
        <textarea
          v-model="form.description"
          placeholder="Deskripsi"
          class="w-full border px-3 py-2 rounded"
        />
        <input
          v-model="form.price"
          type="number"
          placeholder="Harga"
          class="w-full border px-3 py-2 rounded"
        />

        <select v-model="form.category" class="w-full border px-3 py-2 rounded">
          <option disabled value="">Pilih Kategori</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <input type="file" @change="handleImage" class="w-full" />
        <div v-if="previewUrl" class="mt-2">
          <img :src="previewUrl" alt="Preview" class="h-32 object-cover rounded" />
        </div>

        <div class="flex justify-end space-x-2 pt-4">
          <button @click="$emit('close')" class="px-3 py-1 border rounded">Batal</button>
          <button
            @click="submit"
            class="bg-[#7A4A39] text-white px-4 py-2 rounded"
            :disabled="isSaving"
          >
            {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>