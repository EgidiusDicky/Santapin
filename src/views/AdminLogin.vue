<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

function handleLogin() {
  loading.value = true
  error.value = ''

  // Fake login
  setTimeout(() => {
    loading.value = false

    if (email.value === 'admin@example.com' && password.value === 'admin123') {
      localStorage.setItem('isAdminLoggedIn', 'true')

      alert('Login successful! Redirecting to admin dashboard.')
      router.push('/admin/dashboard')
    } else {
      error.value = 'Invalid email or password.'
    }

  }, 1000)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="bg-white max-w-md w-full p-8 rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-700">Admin Login</h2>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block mb-1 font-medium text-gray-600">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="admin@example.com"
            required
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label for="password" class="block mb-1 font-medium text-gray-600">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            minlength="6"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-[#814C3C] text-white py-2 rounded hover:bg-[#3D5943] transition"
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p v-if="error" class="mt-4 text-red-600 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>

</style>
