<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const email = ref('')
const password = ref('')
const route = useRoute()
const auth = useAuthStore()

const isLogin = computed(() => route.path === '/login')

function handleLogin() {
  auth.login({ email: email.value, password: password.value, isAdmin: false })
}
</script>

<template>
  <div class="flex justify-center items-center py-10">
    <div class="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
      <h2 class="text-center text-lg font-bold text-[#5E1B00] mb-4">Santapin</h2>

      <div class="tab-switch">
        <router-link to="/login" class="tab-button-link">
          <button :class="{ active: isLogin }">Login</button>
        </router-link>
        <router-link to="/register" class="tab-button-link">
          <button :class="{ active: !isLogin }">Register</button>
        </router-link>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm">Email</label>
          <input v-model="email" type="email" class="w-full mt-1 border border-gray-300 px-3 py-2 rounded text-sm" placeholder="Enter your email" required />
        </div>

        <div class="mb-4">
          <label class="block text-sm">Password</label>
          <input v-model="password" type="password" class="w-full mt-1 border border-gray-300 px-3 py-2 rounded text-sm" placeholder="Enter your password" required />
        </div>

        <p v-if="password.length > 0 && password.length < 6" class="text-red-500 text-xs">Password too short</p>

        <button type="submit"
          class="w-full bg-[#814C3C] text-white py-2 rounded hover:bg-[#3D5943] transition"
          :disabled="auth.loading">
          {{ auth.loading ? 'Logging in...' : 'Login' }}
        </button>

        <p v-if="auth.error" class="mt-4 text-red-600 text-center">{{ auth.error }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
.tab-switch {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.tab-button-link {
  width: 48%;
}

.tab-button-link button {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #7d4b3f;
  background-color: white;
  color: #7d4b3f;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.tab-button-link button.active {
  background-color: #7d4b3f;
  color: white;
}
</style>
