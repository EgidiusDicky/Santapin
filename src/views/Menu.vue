<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useMenuStore } from '@/stores/menuStore'
import MenuCard from '@/components/MenuCard.vue'

const route = useRoute()
const cart = useCartStore()
const menuStore = useMenuStore()

const selectedCategory = ref('Semua')
const categories = ['Semua', 'Makanan', 'Minuman']

const itemId = computed(() => Number(route.params.id))
const item = computed(() => menuStore.getItemById(itemId.value))

const showPopup = ref(false)
const popupMessage = ref('')

function triggerPopup(message) {
  popupMessage.value = message
  showPopup.value = true
  setTimeout(() => {
    showPopup.value = false
  }, 2000)
}

const filteredMenu = computed(() => {
  if (selectedCategory.value === 'Semua') return menuStore.menuItems
  return menuStore.menuItems.filter(item => item.category === selectedCategory.value)
})

onMounted(() => {
  menuStore.fetchMenuItems()
})
</script>

<template>
  <div id="bg" class="w-full p-4 mx-auto">
    <h1 class="text-black text-3xl font-bold mb-6">Menu Kami</h1>

    <!-- Category Buttons -->
    <div class="flex justify-start gap-4 mb-8">
      <button
        v-for="cat in categories"
        :key="cat"
        @click="selectedCategory = cat"
        :class="[ 
          'px-4 py-2 rounded-lg border shadow-lg', 
          selectedCategory === cat 
            ? 'bg-[#3d5943] text-white border-[#814C3C]' 
            : 'bg-white text-[#814C3C] border-[#814C3C] transition duration-300 hover:bg-[#814C3C] hover:text-white' 
        ]"
      >
        {{ cat }}
      </button>
    </div>

    <!-- Menu Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <MenuCard
        v-for="item in filteredMenu"
        :key="item.id"
        :item="item"
        @add-to-cart="(item) => { cart.addToCart(item); triggerPopup('Makanan berhasil ditambahkan ke keranjang!') }"
      />
    </div>

    <!-- No Products Message -->
    <div v-if="!menuStore.loading && filteredMenu.length === 0" class="text-center text-gray-600 mt-8">
      Tidak ada menu yang tersedia untuk kategori ini.
    </div>

    <!-- Loading -->
    <div v-if="menuStore.loading" class="text-center text-gray-600 mt-8">
      Memuat data...
    </div>

    <!-- Error -->
    <div v-if="menuStore.error" class="text-red-500 text-center mt-4">
      Gagal memuat data menu. Silakan coba lagi nanti.
    </div>

    <!-- Pop-up -->
    <transition name="fade">
      <div
        v-if="showPopup"
        class="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50"
      >
        {{ popupMessage }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
#bg {
  background-color: whitesmoke;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>