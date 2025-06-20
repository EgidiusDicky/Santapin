<script setup>
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore' // <--- IMPORT AUTH STORE ANDA

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore() // <--- INISIALISASI AUTH STORE

const menuItems = [
  { name: 'Dashboard', path: '/admin/dashboard' },
  { name: 'Manage Menu', path: '/admin/manage-menu' },
  { name: 'View Order', path: '/admin/view-order' },
  { name: 'Feedback', path: '/admin/feedback' },
  { name: 'Pengaturan Tim', path: '/admin/manage-team' },
  { name: 'Pengaturan Info', path: '/admin/info-management' },
]

async function logout() { // <--- JADIKAN ASYNC JIKA LOGOUT MENGGUNAKAN API CALL
  // alert('Logging out...'); // Baris ini bisa dihapus jika tidak diperlukan
  await authStore.logout(); // <--- PANGGIL FUNGSI LOGOUT DARI AUTH STORE
  // Redirect ke halaman login akan ditangani oleh authStore.logout()
  // atau oleh interceptor axios jika backend mengembalikan 401
  // router.push('/'); // Baris ini kemungkinan tidak lagi diperlukan karena authStore akan mengurus redirect
}
</script>

<template>
  <div class="flex flex-col h-screen bg-[#814C3C] text-white w-64 p-6">
    <h1 class="text-2xl font-bold mb-10">Santapin Admin</h1>

    <nav class="flex flex-col gap-4 flex-grow">
      <button
        v-for="item in menuItems"
        :key="item.name"
        @click="router.push(item.path)"
        :class="[
          'text-left px-4 py-3 rounded hover:bg-[#3D5943] transition',
          route.path === item.path ? 'bg-[#3D5943]' : ''
        ]"
      >
        {{ item.name }}
      </button>
    </nav>

    <button
        @click="logout"
        class="mt-auto bg-red-600 hover:bg-red-700 px-4 py-3 rounded transition"
    >
      Logout
    </button>
  </div>
</template>

<style scoped>
</style>