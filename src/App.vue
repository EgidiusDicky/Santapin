<script setup>
import { useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import { useAuthStore } from './stores/authStore'
import { useCartStore } from './stores/cartStore'
import { useNotificationStore } from './stores/notificationStore'

const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const notificationStore = useNotificationStore()

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
    <transition name="fade-notification"> <div
        v-if="notificationStore.showPopup"
        :class="[
          'fixed bottom-5 right-5 text-white px-4 py-2 rounded shadow-lg z-50',
          {
            'bg-green-600': notificationStore.popupType === 'success',
            'bg-red-600': notificationStore.popupType === 'error',
            'bg-blue-600': notificationStore.popupType === 'info'
          }
        ]"
      >
        {{ notificationStore.popupMessage }}
      </div>
    </transition>
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-notification-enter-active, .fade-notification-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-notification-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-notification-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>