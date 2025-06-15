<script setup>
import { ref, watch } from 'vue'

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

watch(() => props.product, (newVal) => {
  if (newVal) {
    form.value = {
      name: newVal.name,
      description: newVal.description,
      price: newVal.price,
      category: newVal.category,
      image: null,
    }
    previewUrl.value = newVal.image
  } else {
    form.value = { name: '', description: '', price: '', category: '', image: null }
    previewUrl.value = null
  }
}, { immediate: true })

const handleImage = (e) => {
  const file = e.target.files[0]
  form.value.image = file
  previewUrl.value = URL.createObjectURL(file)
}

const submit = async () => {
  const formData = new FormData()
  for (const key in form.value) {
    if (form.value[key] !== null) {
      formData.append(key, form.value[key])
    }
  }

  if (props.product) {
    await axios.post(`/products/${props.product.id}?_method=PUT`, formData)
  } else {
    await axios.post('/products', formData)
  }

  emit('saved')
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">{{ product ? 'Edit' : 'Add' }} Product</h2>
      <div class="space-y-3">
        <input v-model="form.name" type="text" placeholder="Name" class="w-full border px-3 py-2 rounded" />
        <textarea v-model="form.description" placeholder="Description" class="w-full border px-3 py-2 rounded" />
        <input v-model="form.price" type="number" placeholder="Price" class="w-full border px-3 py-2 rounded" />
        <input v-model="form.category" type="text" placeholder="Category" class="w-full border px-3 py-2 rounded" />
        <input type="file" @change="handleImage" class="w-full" />
        
        <div v-if="previewUrl" class="mt-2">
          <img :src="previewUrl" alt="Preview" class="h-32 object-cover rounded" />
        </div>

        <div class="flex justify-end space-x-2 pt-4">
          <button @click="$emit('close')" class="px-3 py-1 border rounded">Cancel</button>
          <button @click="submit" class="bg-[#7A4A39] text-white px-4 py-2 rounded">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>
