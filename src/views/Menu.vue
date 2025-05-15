<script setup>
import { ref, computed } from 'vue'

const categories = ['Semua', 'Makanan', 'Minuman']
const selectedCategory = ref('Semua')

// Sample Menu Items
const menuItems = ref([
  {
    id: 1,
    name: 'Nasi Goreng',
    description: 'Nasi goreng khas Indonesia.',
    price: 25000,
    image: 'https://via.placeholder.com/300x200?text=Nasi+Goreng',
    category: 'Makanan',
  },
  {
    id: 2,
    name: 'Es Teh Manis',
    description: 'Minuman dingin teh manis.',
    price: 8000,
    image: 'https://via.placeholder.com/300x200?text=Es+Teh',
    category: 'Minuman',
  },
  {
    id: 3,
    name: 'Mie Ayam',
    description: 'Mie ayam dengan topping melimpah.',
    price: 20000,
    image: 'https://via.placeholder.com/300x200?text=Mie+Ayam',
    category: 'Makanan',
  },
  {
    id: 4,
    name: 'Jus Alpukat',
    description: 'Jus alpukat segar.',
    price: 15000,
    image: 'https://via.placeholder.com/300x200?text=Jus+Alpukat',
    category: 'Minuman',
  },
  // New Items Below
  {
    id: 5,
    name: 'Sate Ayam',
    description: 'Sate ayam dengan bumbu kacang khas.',
    price: 30000,
    image: 'https://via.placeholder.com/300x200?text=Sate+Ayam',
    category: 'Makanan',
  },
  {
    id: 6,
    name: 'Bakso',
    description: 'Semangkuk bakso sapi dengan kuah gurih.',
    price: 22000,
    image: 'https://via.placeholder.com/300x200?text=Bakso',
    category: 'Makanan',
  },
  {
    id: 7,
    name: 'Rendang',
    description: 'Rendang daging sapi khas Padang.',
    price: 35000,
    image: 'https://via.placeholder.com/300x200?text=Rendang',
    category: 'Makanan',
  },
  {
    id: 8,
    name: 'Es Jeruk',
    description: 'Minuman jeruk segar dingin.',
    price: 9000,
    image: 'https://via.placeholder.com/300x200?text=Es+Jeruk',
    category: 'Minuman',
  },
  {
    id: 9,
    name: 'Kopi Tubruk',
    description: 'Kopi hitam khas Indonesia.',
    price: 12000,
    image: 'https://via.placeholder.com/300x200?text=Kopi+Tubruk',
    category: 'Minuman',
  },
  {
    id: 10,
    name: 'Teh Tarik',
    description: 'Teh tarik khas Malaysia dengan busa lembut.',
    price: 10000,
    image: 'https://via.placeholder.com/300x200?text=Teh+Tarik',
    category: 'Minuman',
  },
])

const filteredMenu = computed(() => {
  if (selectedCategory.value === 'Semua') return menuItems.value
  return menuItems.value.filter(
    item => item.category === selectedCategory.value
  )
})
</script>
<template>
  
  <div class="bg-gray-100 min-h-screen py-10">
  <div class="p-4 max-w-6xl mx-auto">
    <!-- Header -->
    <h1 class="text-3xl font-bold mb-6" style="color: #814C3C">Menu Kami</h1>

    <!-- Category Buttons -->
    <div class="flex justify-start gap-4 mb-8">
      <button
        v-for="cat in categories"
        :key="cat"
        @click="selectedCategory = cat"
        :class="[ 
          'px-4 py-2 rounded-full border', 
          selectedCategory === cat 
            ? 'bg-[#814C3C] text-white border-[#814C3C]' 
            : 'bg-white text-[#814C3C] border-[#814C3C] hover:bg-[#814C3C] hover:text-white' 
        ]"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Menu Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="item in filteredMenu"
        :key="item.id"
        class="rounded-lg p-4 flex flex-col shadow-lg "
        style="min-height: 380px;" 
      >
        <div 
          class="w-full h-40 bg-gray-200 rounded-md mb-4 flex justify-center items-center"
          :style="!item.image ? 'background-color: #d1d5db;' : ''"
        >
          <img
            v-if="item.image"
            :src="item.image"
            :alt="item.name"
            class="w-full h-full object-cover rounded-md text-black "
          />
          <span v-else class="text-gray-500 text-lg">No Image</span>
        </div>

        <h2 class="text-xl text-black  font-semibold mb-2">{{ item.name }}</h2>
        <p class="text-sm text-black mb-2">{{ item.description }}</p>
        <div class="mt-auto">
          <span class="text-lg font-bold text-[#814C3C] block mb-2">Rp{{ item.price }}</span>
          <button
            class="bg-[#3d5943] text-white w-full py-2 rounded hover:bg-[#814C3C]"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
 
  </div>
  
</template>

<style scoped>
.body{
    background-color: whitesmoke;
}
</style>
