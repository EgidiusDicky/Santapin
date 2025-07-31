<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useMenuStore } from '@/stores/menuStore'
import { useCartStore } from '@/stores/cartStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { ref, computed } from 'vue'

const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()
const cart = useCartStore()
const notificationStore = useNotificationStore()
const imageBaseUrl = import.meta.env.VITE_APP_IMAGE_URL;
const quantity = ref(1)
const menuId = Number(route.params.id)
const menu = computed(() => menuStore.getItemById(menuId))

const totalPrice = computed(() => {
  // Pastikan menu dan harganya ada sebelum menghitung
  if (menu.value && typeof menu.value.price === 'number') {
    return menu.value.price * quantity.value;
  }
  return 0; // Nilai default jika data belum siap
});
// ---------------------------------------------

const goBack = () => {
    if (window.history.length > 1) {
        router.back()
    } else {
        router.push('/menu') 
    }
}

const addToCart = async () => {
    if (menu.value) {
        const itemToAdd = {
            id: menu.value.id,
            name: menu.value.name,
            price: menu.value.price,
            image: menu.value.image,
            quantity: quantity.value,
        }
        try {
            await cart.addToCart(itemToAdd)
            notificationStore.triggerPopup(`${quantity.value} ${menu.value.name} berhasil ditambahkan ke keranjang!`, 'success');
        } catch (error) {
            // Logika penanganan error untuk login
            if (error.message.includes('User must be logged in')) {
              notificationStore.triggerPopup('Anda harus login terlebih dahulu!', 'error');
              setTimeout(() => { 
                router.push('/login');
              }, 2000);
            } else {
              notificationStore.triggerPopup(`Gagal menambahkan produk: ${error.message || 'Terjadi kesalahan.'}`, 'error');
            }
        }
    }
}

const handleAddToCart = () => {
    addToCart()
}

const increaseQty = () => {
    quantity.value++
}

const decreaseQty = () => {
    if (quantity.value > 1) quantity.value--
}

// Dummy reviews
const reviews = [
    { name: 'Ucok', stars: 5, date: '2 hari lalu', text: 'Bakso nya Enak, porsinya banyak cocok sama harganya.' },
    { name: 'Mamang', stars: 4, date: '1 minggu lalu', text: 'Porsi banyak, enak' },
    { name: 'Sinta', stars: 5, date: '2 minggu lalu', text: "enak, kenyang" }
]
</script>

<template>
  <div class="bg-white text-[#5B3A29]">
    <div v-if="menu">
      <!-- Breadcrumb -->
      <nav aria-label="Breadcrumb" class=" text-gray-600 mb-4 select-none px-6 sm:px-9 pt-6">
        <!-- Back Arrow Bar -->
          <div class="relative z-10 w-full mx-auto">
          <button class="flex space-x-2" @click="goBack">
              <img src="../asset/Back arrow icon.svg" alt="">
              <h2>Back</h2>
          </button>
          </div>
      </nav>

      <!-- Main Content -->
      <main class="max-w-7xl mx-auto px-6 sm:px-10 pb-16">
        <section class="flex flex-col sm:flex-row gap-8 sm:gap-12">
          <!-- Image -->
          <div class="flex-shrink-0 w-full sm:w-[400px] aspect-video bg-gray-200 rounded-lg overflow-hidden">
            <img
                :src="`${imageBaseUrl}/${menu.image}`"
                :alt="menu.name"
                @error="$event.target.src = '/no-image.png'"
                class="w-full h-full object-cover"
                />
          </div>

          <!-- Details -->
          <div class="flex-1">
            <h1 class="text-2xl font-extrabold mb-3">{{ menu.name }}</h1>
            <p class="text-sm mb-4 leading-relaxed max-w-xl">{{ menu.description }}</p>
            
            <p class="font-bold text-[#7A4A39] mb-4 text-2xl">
              Rp. {{ totalPrice.toLocaleString('id-ID') }}
            </p>

            <!-- Quantity Control -->
            <div class="flex items-center space-x-3 mb-6">
              <button @click="decreaseQty" class="border border-[#7A4A39] text-[#7A4A39] rounded-md w-8 h-8 flex items-center justify-center text-lg font-semibold hover:bg-[#7A4A39] hover:text-white transition">−</button>
              <span class="text-base font-normal w-8 text-center">{{ quantity }}</span>
              <button @click="increaseQty" class="border border-[#7A4A39] text-[#7A4A39] rounded-md w-8 h-8 flex items-center justify-center text-lg font-semibold hover:bg-[#7A4A39] hover:text-white transition">+</button>
            </div>
            <!-- Add to Cart Button -->
            <button @click="handleAddToCart" class="w-full bg-[#7A4A39] text-white font-semibold rounded-md py-2 hover:bg-[#6a3f31] transition">
              Tambah ke keranjang
            </button>

            <!-- Reviews -->
            <section class="mt-10 max-w-xl">
              <h2 class="font-semibold text-lg mb-3">Customer Reviews</h2>
              <div v-for="(review, index) in reviews" :key="index" class="mb-6">
                <p class="text-sm font-semibold mb-0.5">
                  {{ review.name }}
                  <span class="text-[#B94A2A] ml-1">
                    <i v-for="n in review.stars" :key="n" class="fas fa-star"></i>
                  </span>
                  <span class="text-xs text-gray-500 ml-2 font-normal">{{ review.date }}</span>
                </p>
                <p class="text-xs text-[#5B3A29] mt-1 leading-tight">{{ review.text }}</p>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>

    <!-- Menu not found -->
    <div v-else class="text-center py-20 text-gray-500">
      <p>Menu tidak ditemukan.</p>
    </div>
  </div>
</template>
