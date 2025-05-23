<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)
</script>

<template>
  <nav class=" flex items-center justify-between px-6 py-4 shadow-md bg-white sticky top-0 z-50">
    <div class="text-2xl font-bold transition-transform duration-500 hover:text-[#3D5943] hover:scale-105">
        <RouterLink 
        @click="isMenuOpen = false"
        to="/" class="nav-link" active-class="text-primary font-semibold">Santapin</RouterLink>
    </div>

    <!-- Navigasi Desktop -->
    <div class="hidden md:flex items-center space-x-6">
      <ul class="flex space-x-6">
        <li><RouterLink to="/" class="nav-link" active-class="text-primary font-semibold">Home</RouterLink></li>
        <!-- Dropdown Filter List -->
        <li class="relative group">
          <RouterLink to="/menu" class="nav-link" active-class="text-primary font-semibold">
            Menu
          </RouterLink>
          <!-- <ul class="absolute left-1/2 -translate-x-1/2 mt-2 w-30 bg-white shadow-md rounded-md opacity-0 
                     invisible group-hover:opacity-100 group-hover:visible group-hover:delay-200 transition 
                     duration-300 space-y-2 z-50 text-center">
            <li><RouterLink to="/menu" class="block px-4 py-2 hover:bg-gray-100">Semua</RouterLink></li>
            <li><RouterLink to="/menu" class="block px-4 py-2 hover:bg-gray-100 rounded-md">Makanan</RouterLink></li>
            <li><RouterLink to="/menu" class="block px-4 py-2 hover:bg-gray-100 rounded-md">Minuman</RouterLink></li>
          </ul> -->
        </li>
        <li><RouterLink to="/orders" class="nav-link" active-class="text-primary font-semibold">Pesanan</RouterLink></li>
        <li><RouterLink to="/cart" class="nav-link" active-class="text-primary font-semibold">Keranjang</RouterLink></li>
      </ul>
      <!-- Tombol Login -->
      <RouterLink to="/login" class="bg-[#814C3C] text-white text-sm font-semibold rounded px-4 py-1.5 duration-500 hover:bg-[#3D5943]">
        Login
      </RouterLink>
    </div>

    <!-- Hamburger icon (Mobile) -->
    <div class="md:hidden ml-auto">
      <button @click="isMenuOpen = !isMenuOpen">
        <img src="../asset/Hamburger icon.svg" alt="hamburger icon">
      </button>
    </div>
    
    <transition
      enter-active-class="transition-all duration-300 ease-in-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in-out"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <!-- Navigasi Dropdown Mobile -->
      <div v-if="isMenuOpen" class="absolute top-full left-0 w-full bg-[#DDDDDD] shadow-md z-40 md:hidden px-6 py-4">
        <ul class="flex flex-col space-y-4">
          <li @click="isMenuOpen = false">
            <RouterLink
              to="/"
              class="block w-full py-2 px-4 rounded text-left duration-300 hover:bg-gray-100 nav-link"
              active-class="text-primary font-semibold"
            >
              Home
            </RouterLink>
          </li>
          <li @click="isMenuOpen = false">
            <RouterLink
              to="/menu"
              class="block w-full py-2 px-4 rounded text-left duration-300 hover:bg-gray-100 nav-link"
              active-class="text-primary font-semibold"
            >
              Menu
            </RouterLink>
          </li>
          <li @click="isMenuOpen = false">
            <RouterLink
              to="/orders"
              class="block w-full py-2 px-4 rounded text-left duration-300 hover:bg-gray-100 nav-link"
              active-class="text-primary font-semibold"
            >
              Pesanan
            </RouterLink>
          </li>
          <li @click="isMenuOpen = false">
            <RouterLink
              to="/cart"
              class="block w-full py-2 px-4 rounded text-left duration-300 hover:bg-gray-100 nav-link"
              active-class="text-primary font-semibold"
            >
              Keranjang
            </RouterLink>
          </li>
          <li @click="isMenuOpen = false">
            <RouterLink
              to="/login"
              class="block w-full py-2 px-4 rounded text-left duration-300 hover:bg-gray-100 nav-link"
              active-class="text-primary font-semibold"
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