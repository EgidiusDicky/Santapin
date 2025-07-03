<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router' // 1. Impor useRouter
import { useCartStore } from '@/stores/cartStore'
import { useMenuStore } from '@/stores/menuStore'
import MenuCard from '@/components/MenuCard.vue'

const route = useRoute()
const cart = useCartStore()
const menuStore = useMenuStore()
const router = useRouter()

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

// 3. Buat fungsi baru untuk menangani logika add to cart
async function handleAddToCart(item) {
  try {
    // Mencoba menambahkan item ke keranjang
    await cart.addToCart(item);
    // Jika berhasil, tampilkan notifikasi sukses
    triggerPopup('Berhasil ditambahkan ke keranjang!');
  } catch (error) {
    // Jika gagal, tangkap error di sini
    if (error.message.includes('User must be logged in')) {
      alert('Anda harus login terlebih dahulu untuk menambahkan item.');
      router.push('/login'); // Arahkan ke halaman login
    } else {
      // Untuk error lainnya
      alert('Gagal menambahkan produk: ' + error.message);
    }
  }
}

onMounted(() => {
  menuStore.fetchMenuItems()
})
</script>

<template>
  <div id="bg" class="w-full p-4 mx-auto">
    <h1 class="text-black text-3xl font-bold mb-6">Menu Kami</h1>

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

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <MenuCard
        v-for="(item, index) in filteredMenu" :key="item.id"
        :item="item"
        :index="index" 
        @add-to-cart="handleAddToCart"
      />
    </div>

    <div v-if="!menuStore.loading && filteredMenu.length === 0" class="text-center text-gray-600 mt-8">
      Tidak ada menu yang tersedia untuk kategori ini.
    </div>

    <div v-if="menuStore.loading" class="text-center text-gray-600 mt-8">
      Memuat data...
    </div>

    <div v-if="menuStore.error" class="text-red-500 text-center mt-4">
      Gagal memuat data menu. Silakan coba lagi nanti.
    </div>

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