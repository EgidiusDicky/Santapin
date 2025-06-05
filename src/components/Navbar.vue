<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'Pesanan', path: '/orders' },
  { label: 'Keranjang', path: '/cart' },
  { label: 'Login', path: '/login' },
]
</script>

<template>
  <nav class="bg-white shadow-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
    <!-- Logo -->
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
        <li v-for="item in navItems.slice(0, -1)" :key="item.path">
          <RouterLink
            :to="item.path"
            class="nav-link"
            active-class="text-primary font-semibold"
          >
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>
      <RouterLink
        :to="navItems.at(-1).path"
        class="bg-[#814C3C] text-white text-sm font-semibold px-4 py-1.5 rounded hover:bg-[#3D5943] transition"
      >
        {{ navItems.at(-1).label }}
      </RouterLink>
    </div>

    <!-- Mobile Hamburger -->
    <div class="md:hidden">
      <button @click="isMenuOpen = !isMenuOpen" aria-label="Toggle menu">
        <img src="../asset/Hamburger icon.svg" alt="menu icon" />
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
