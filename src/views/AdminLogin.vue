<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const email = ref('')
const password = ref('')
const auth = useAuthStore()

function handleLogin() {
  auth.adminLogin({ email: email.value, password: password.value })
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="bg-white max-w-md w-full p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-700">Admin Login</h2>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="adminEmail" class="block mb-1 font-medium text-gray-600">Email</label>
          <input
            v-model="email"
            type="email"
            id="adminEmail" name="admin_email" required
            placeholder="Email Admin"
            class="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label for="adminPassword" class="block mb-1 font-medium text-gray-600">Password</label>
          <input
            v-model="password"
            type="password"
            id="adminPassword" name="admin_password" required
            placeholder="••••••••"
            class="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-[#814C3C] text-white py-2 rounded hover:bg-[#3D5943] transition"
          :disabled="auth.loading" >
          {{ auth.loading ? 'Logging in...' : 'Login' }}
        </button>

        <p v-if="auth.error" class="mt-4 text-red-600 text-center">{{ auth.error }}</p>
      </form>
    </div>
  </div>
</template>