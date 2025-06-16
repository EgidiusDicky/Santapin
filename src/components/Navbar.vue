<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue' // Import onMounted, onUnmounted
import { useAuthStore } from '@/stores/authStore'
import { RouterLink } from 'vue-router'

const auth = useAuthStore()
const isMenuOpen = ref(false)
const isProfileDropdownOpen = ref(false) // New: Control for profile dropdown
const profileDropdownRef = ref(null); // Ref for dropdown element to detect outside clicks

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Menu', path: '/menu' },
  { label: 'Pesanan', path: '/orders' },
  { label: 'Keranjang', path: '/cart' }
]

const isLoggedIn = computed(() => !!auth.token)

// New: Toggle function for profile dropdown
const toggleProfileDropdown = () => {
  isProfileDropdownOpen.value = !isProfileDropdownOpen.value
}

// New: Close function for profile dropdown
const closeProfileDropdown = () => {
  isProfileDropdownOpen.value = false
}

// New: Handle logout (closes dropdown and then logs out)
const handleLogout = () => {
  closeProfileDropdown(); // Close dropdown first
  auth.logout(); // Then log out
}

// New: Click outside listener for profile dropdown
const handleClickOutside = (event) => {
  if (profileDropdownRef.value && !profileDropdownRef.value.contains(event.target)) {
    closeProfileDropdown();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
})
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
        <div class="relative" ref="profileDropdownRef"> <button
            @click="toggleProfileDropdown"
            class="flex items-center text-sm text-gray-600 px-3 py-1.5 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#814C3C]"
            aria-haspopup="true"
            :aria-expanded="isProfileDropdownOpen ? 'true' : 'false'"
          >
            👤 {{ auth.user?.name || 'User' }}
            <svg class="w-4 h-4 ml-1 transition-transform duration-200" :class="{ 'rotate-180': isProfileDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="isProfileDropdownOpen"
              class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
              tabindex="-1"
            >
              <div class="py-1" role="none"> 
                <!-- bisa ditambah Profile diatas Logout -->
                <button
                  @click="handleLogout"
                  class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  tabindex="-1"
                >
                  Logout
                </button>
              </div>
            </div>
          </transition>
        </div>
      </template>
      <RouterLink
        v-else
        to="/login"
        class="bg-[#814C3C] text-white text-sm font-semibold px-4 py-1.5 rounded hover:bg-[#3D5943] transition"
      >
        Login
      </RouterLink>
    </div>

    <div class="md:hidden">
      <button @click="isMenuOpen = !isMenuOpen" aria-label="Toggle menu">
        <img src="/asset/hamburger-icon.svg" alt="menu icon" width="24" height="24" />
      </button>
    </div>

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
  @apply text-gray-600 hover:text-[#814C3C]; /* Adjusted hover color to match primary button */
}

/* Optional: Fade transition for dropdown */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-0.25rem); /* Slight upward move */
}
</style>