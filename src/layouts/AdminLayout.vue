<script setup>
import AdminSidebar from '../components/AdminSidebar.vue'
import { useRouter } from 'vue-router'
const router = useRouter()

function logout() {
  localStorage.removeItem('isAdminLoggedIn')
  router.push('/admin-login')
}
</script>

<template>
  <div class="flex min-h-screen">
    <div class="w-64 h-screen fixed top-0 left-0 bg-white shadow-md z-10">
      <AdminSidebar />
    </div>
    <div class="flex-grow ml-64 overflow-y-auto p-6 bg-gray-100 h-screen">
      <router-view />
    </div>
  </div>
</template>
