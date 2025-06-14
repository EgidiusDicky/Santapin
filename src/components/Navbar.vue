<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { RouterLink } from 'vue-router'

const auth = useAuthStore()
const isMenuOpen = ref(false)

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'Pesanan', path: '/orders' },
  { label: 'Keranjang', path: '/cart' }
]

const isLoggedIn = computed(() => !!auth.token)
</script>

<template>
  <nav class="bg-white shadow-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
    <RouterLink
      to="/"
      class="text-2xl font-bold transition hover:text-[#3D5943] hover:scale-105"
      @click="isMenuOpen = false"
    >
      Santapin
    </RouterLink>

    <!-- Desktop Navigation -->
    <div class="hidden md:flex items-center space-x-6">
      <ul class="flex space-x-6">
        <li v-for="item in navItems" :key="item.path">
          <RouterLink
            :to="item.path"
            class="nav-link"
            active-class="text-primary font-semibold"
          >
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>

      <template v-if="isLoggedIn">
        <span class="text-sm text-gray-600 mr-2">
          👤 {{ auth.user?.name || 'User' }}
        </span>
        <button
          @click="auth.logout"
          class="bg-red-500 text-white text-sm font-semibold px-4 py-1.5 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </template>
      <RouterLink
        v-else
        to="/login"
        class="bg-[#814C3C] text-white text-sm font-semibold px-4 py-1.5 rounded hover:bg-[#3D5943] transition"
      >
        Login
      </RouterLink>
    </div>

    <!-- Mobile -->
    <div class="md:hidden">
      <button @click="isMenuOpen = !isMenuOpen" aria-label="Toggle menu">
        <img src="/asset/hamburger-icon.svg" alt="menu icon" width="24" height="24" />
      </button>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition duration-300 ease-in-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in-out"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMenuOpen"
        class="absolute top-full left-0 w-full bg-[#DDDDDD] shadow-md z-40 md:hidden px-6 py-4"
      >
        <ul class="flex flex-col space-y-4">
          <li
            v-for="item in navItems"
            :key="item.path"
            @click="isMenuOpen = false"
          >
            <RouterLink
              :to="item.path"
              class="block w-full py-2 px-4 rounded text-left hover:bg-gray-100 nav-link"
              active-class="text-primary font-semibold"
            >
              {{ item.label }}
            </RouterLink>
          </li>
          <li v-if="isLoggedIn" @click="isMenuOpen = false">
            <span class="block py-2 px-4">👤 {{ auth.user?.name || 'User' }}</span>
            <button
              @click="auth.logout"
              class="w-full bg-red-500 text-white py-2 rounded mt-2"
            >
              Logout
            </button>
          </li>
          <li v-else @click="isMenuOpen = false">
            <RouterLink
              to="/login"
              class="block bg-[#814C3C] text-white py-2 px-4 rounded text-center hover:bg-[#3D5943]"
            >
              Login
            </RouterLink>
          </li>
        </ul>
      </div>
    </transition>
  </nav>
</template>

<style scoped lang="postcss">
.nav-link {
  @apply text-gray-600 hover:text-primary;
}
</style>
