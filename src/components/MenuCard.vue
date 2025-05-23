<script setup>
import { useCartStore } from '@/stores/cartStore'

const props = defineProps({
   item: Object,
})

const emit = defineEmits(['add-to-cart'])

const cart = useCartStore()
</script>

<template>
  <div
    class="bg-white rounded-lg p-4 flex flex-col shadow-lg"
    style="min-height: 380px;"
  >
    <!-- Foto Menu -->
    <router-link :to="`/menu/${item.id}`">
    <div
      class="w-full h-40 bg-gray-200 rounded-md mb-4 flex justify-center items-center"
      :style="!item.image ? 'background-color: #d1d5db;' : ''"
    >
      <img
        v-if="item.image"
        :src="item.image"
        :alt="item.name"
        class="w-full h-full object-cover rounded-md text-black"
      />
      <span v-else class="text-gray-500 text-lg">No Image</span>
    </div>

    <!-- Detail Menu -->
    <h2 class="text-xl text-black font-semibold mb-2">{{ item.name }}</h2>
    <p class="text-sm text-black mb-2">{{ item.description }}</p>
    </router-link>

    <!-- Harga dan Button -->
    <div class="mt-auto">
      <span class="text-lg font-bold text-[#814C3C] block mb-2">Rp{{ item.price }}</span>
      <button
        class="bg-[#814C3C] text-white w-full py-2 rounded hover:bg-[#3d5943]"
        @click="emit('add-to-cart', { ...item, quantity: 1 })"
      >
        Tambah ke keranjang
      </button>
    </div>
  </div>
</template>