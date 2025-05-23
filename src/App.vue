<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

const route = useRoute()

// List halaman yang tidak memerlukan navbar dan footer
const noLayoutRoutes = [
  '/admin',
  '/admin-login',
  '/checkout',
  '/orders-tracking',
  '/receipt',
  '/about'
]

// Mengecek apakah route = /isLayoutHidden
const isLayoutHidden = computed(() =>
  noLayoutRoutes.some(hidden => route.path.startsWith(hidden))
)
</script>

<template>
  <div class="text-[#814C3C] min-h-screen flex flex-col">
    <!-- Navbar disembunyikan jika route = /isLayoutHidden -->
    <Navbar v-if="!isLayoutHidden" />

    <transition name="fade" mode="out-in">
      <router-view v-slot="{ Component }">
        <component :is="Component" />
      </router-view>
    </transition>


    <!-- Footer disembunyikan jika route = /isLayoutHidden -->
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