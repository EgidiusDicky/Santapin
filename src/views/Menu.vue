<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cartStore'
import { useMenuStore } from '@/stores/menuStore'
import MenuCard from '@/components/MenuCard.vue'

const menuStore = useMenuStore()
const menuItems = computed(() => menuStore.menuItems)

const route = useRoute()

const categories = ['Semua', 'Makanan', 'Minuman']
const selectedCategory = ref('Semua')

const cart = useCartStore()

// Grab the ID from the URL
const itemId = computed(() => Number(route.params.id))

// Get the item from the store
const item = computed(() => menuStore.getItemById(itemId.value))


// Pop up state
const showPopup = ref(false)
const popupMessage = ref('')

function triggerPopup(message) {
  popupMessage.value = message;
  showPopup.value = true;
  setTimeout(() => {
    showPopup.value = false;
  }, 2000);
}

const filteredMenu = computed(() => {
  if (selectedCategory.value === 'Semua') return menuItems.value
  return menuItems.value.filter(item => item.category === selectedCategory.value)
})

</script>

<template>
  <div id="bg" class="w-full p-4 mx-auto">
    <!-- Header -->
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
      <!-- Menu Card -->
      <MenuCard
        v-for="item in filteredMenu"
        :key="item.id"
        :item="item"
        @add-to-cart="(item) => { cart.addToCart(item); triggerPopup('Makanan berhasil ditambahkan ke keranjang!') }"
      />
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
