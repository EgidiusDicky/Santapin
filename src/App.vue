<script setup>
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { useAuthStore } from './stores/authStore'
import { useCartStore } from './stores/cartStore'

const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()

const noLayoutRoutes = [
  '/admin',
  '/admin-login',
  '/checkout',
  '/orders-tracking',
  '/receipt',
  '/about'
]

const isLayoutHidden = computed(() =>
  noLayoutRoutes.some(hidden => route.path.startsWith(hidden))
)

onMounted(async () => {
  await authStore.fetchUser()

  if (authStore.isLoggedIn) {
    await cartStore.fetchCart()
  }
})
</script>

<template>
  <div class="text-[#814C3C] min-h-screen flex flex-col">
    <Navbar v-if="!isLayoutHidden" />

    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    <Footer v-if="!isLayoutHidden" />
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>