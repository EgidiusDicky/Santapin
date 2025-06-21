<script setup>
import { ref, watch } from 'vue'
import axiosClient from '@/axios' // Pastikan jalur ini benar

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

const categories = ['Makanan', 'Minuman'] // Pastikan konsisten dengan backend

const validateForm = () => {
  // Pastikan price adalah angka valid sebelum validasi form
  if (isNaN(parseFloat(form.value.price)) || parseFloat(form.value.price) < 0) {
    return false;
  }
  return form.value.name && form.value.description && form.value.price !== '' && form.value.category
}

watch(
  () => props.product,
  newVal => {
    if (newVal) {
      form.value = {
        name: newVal.name,
        description: newVal.description,
        price: newVal.price, // Pastikan ini adalah angka atau bisa dikonversi ke angka
        category: newVal.category,
        image: null, // Keep this as null so users have to re-select if they want to change
      }
      if (newVal.image) {
        previewUrl.value = newVal.image.startsWith('http')
          ? newVal.image
          : `http://localhost:8000/storage/${newVal.image}`; // Sesuaikan base URL jika berbeda
      } else {
        previewUrl.value = null;
      }
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
  if (file) {
    form.value.image = file
    previewUrl.value = URL.createObjectURL(file)
  } else {
    form.value.image = null;
    previewUrl.value = null;
  }
}

const submit = async () => {
  error.value = null
  success.value = null

  if (!validateForm()) {
    error.value = 'Mohon lengkapi semua field yang wajib diisi dan pastikan harga valid.'
    return
  }

  const formData = new FormData()
  for (const key in form.value) {
    if (key === 'image') {
      if (form.value[key] instanceof File) { // Only append if it's a new file
        formData.append(key, form.value[key])
      } else if (props.product && form.value[key] === null) {
        // If editing, and user clears image or doesn't select new one,
        // and current product already has an image, consider keeping old one
        // or sending a flag to delete. For now, we skip if null.
        // Backend's 'nullable' handles cases where no new image is sent.
        continue;
      }
    } else {
      formData.append(key, form.value[key])
    }
  }

  if (props.product) {
      formData.append('_method', 'PUT'); // Penting untuk Laravel PUT dengan FormData
  }

  isSaving.value = true

  try {
    let res
    if (props.product) {
      res = await axiosClient.post(`/admin/products/${props.product.id}`, formData) // Perhatikan /admin/products
    } else {
      res = await axiosClient.post('/admin/products', formData) // Perhatikan /admin/products
    }

    console.log('Saved successfully:', res.data)
    success.value = 'Produk berhasil disimpan.'
    emit('saved')
  } catch (err) {
    console.error('Save failed:', err.response?.data || err.message)
    let errorMessage = 'Gagal menyimpan produk.';
    if (err.response && err.response.data && err.response.data.errors) {
      // Tampilkan pesan validasi dari Laravel
      const errors = err.response.data.errors;
      errorMessage += '\nValidasi: ';
      for (const field in errors) {
        errorMessage += `${field}: ${errors[field].join(', ')} `;
      }
    } else if (err.response && err.response.data && err.response.data.message) {
      errorMessage += '\n' + err.response.data.message;
    }
    error.value = errorMessage;
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black/10 flex items-center justify-center z-50 backdrop-blur-lg">
    <div class="bg-white p-6 rounded w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">{{ product ? 'Edit' : 'Tambah' }} Produk</h2>

      <div v-if="error" class="text-red-500 text-sm mb-2 whitespace-pre-line">{{ error }}</div>
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

        <input type="file" @change="handleImage" class="w-full" accept="image/*"/>
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