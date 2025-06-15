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
        image: null,
      }
      previewUrl.value = newVal.image?.startsWith('http')
      ? `http://localhost:8000/storage/${newVal.image}`
      : newVal.image
    } else {
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
  form.value.image = file
  previewUrl.value = URL.createObjectURL(file)
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
    if (form.value[key] !== null) {
      formData.append(key, form.value[key])
    }
  }

  isSaving.value = true

  try {
  let res
  if (props.product) {
    res = await axiosClient.post(`/products/${props.product.id}?_method=PUT`, formData)
  } else {
    res = await axiosClient.post('/products', formData)
  }

  console.log('Saved successfully:', res.data)
  success.value = 'Produk berhasil disimpan.'
  emit('saved')
} catch (err) {
  console.error('Save failed:', err.response?.data || err.message)
  error.value = 'Gagal menyimpan produk.'
}

}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 **backdrop-blur-sm**">
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
