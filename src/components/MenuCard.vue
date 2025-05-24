<script setup>
import { useCartStore } from '@/stores/cartStore'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['add-to-cart'])

const cart = useCartStore()
</script>

<template>
  <div class="min-h-[380px] bg-white rounded-lg p-4 flex flex-col shadow-lg">
    <!-- Foto Menu -->
    <router-link :to="`/menu/${item.id}`" class="mb-4">
      <div
        class="w-full h-40 bg-gray-200 rounded-md flex justify-center items-center overflow-hidden"
      >
        <img
          v-if="item.image"
          loading="lazy"
          :src="item.image"
          :alt="item.name"
          class="w-full h-full object-cover rounded-md text-black"
          width="300"
          height="160"
        />
        <span v-else class="text-gray-500 text-lg">No Image</span>
      </div>

      <!-- Detail Menu -->
      <h2 class="text-xl text-black font-semibold mt-2">{{ item.name }}</h2>
      <p class="text-sm text-black mt-1">{{ item.description }}</p>
    </router-link>

    <!-- Harga dan Button -->
    <div class="mt-auto pt-4">
      <span class="text-lg font-bold text-[#814C3C] block mb-2">
        Rp{{ item.price }}
      </span>
      <button
        class="bg-[#814C3C] text-white w-full py-2 rounded hover:bg-[#3d5943] transition-colors"
        :aria-label="`Tambah ${item.name} ke keranjang`"
        @click="emit('add-to-cart', { ...item, quantity: 1 })"
      >
        Tambah ke keranjang
      </button>
    </div>
  </div>
</template>
