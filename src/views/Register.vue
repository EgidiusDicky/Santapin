<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const authStore = useAuthStore()

const isLogin = computed(() => route.path === '/login')

// Form state
const name = ref('')
const email = ref('')
const password = ref('')
const phone = ref('')
const address = ref('')
const confirmPassword = ref('')
const error = ref('')
const loading = ref(false)

// Submit register
const handleRegister = async () => {
  error.value = ''
  loading.value = true

  try {
    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match'
      loading.value = false
      return
    }

    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
      password_confirmation: confirmPassword.value,
      phone: phone.value,
      address: address.value,
    })
  } catch (err) {
    error.value = err?.response?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>


<template>
    <!-- Register Form -->
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

      <form @submit.prevent="handleRegister">
      <div class="mb-4">
        <label class="block text-sm">Email</label>
        <input v-model="email" type="email" required class="w-full mt-1 border border-gray-300 px-3 py-2 rounded text-sm" placeholder="Enter your email">
      </div>

      <div class="mb-4">
        <label class="block text-sm">Password</label>
        <input v-model="password" type="password" required class="w-full mt-1 border border-gray-300 px-3 py-2 rounded text-sm" placeholder="Enter your password">
      </div>

      <div class="mb-4">
        <label class="block text-sm">Confirm Password</label>
        <input v-model="confirmPassword" type="password" required class="w-full mt-1 border border-gray-300 px-3 py-2 rounded text-sm" placeholder="Re-enter your password">
      </div>

      <div class="mb-4">
        <label class="block text-sm">Nama lengkap *</label>
        <input v-model="name" type="text" required class="w-full mt-1 border border-gray-300 px-3 py-2 rounded text-sm" placeholder="Masukkan nama lengkap anda">
      </div>

      <div class="mb-4">
        <label class="block text-sm">Nomor hp *</label>
        <input v-model="phone" type="text" required class="w-full mt-1 border border-gray-300 px-3 py-2 rounded text-sm" placeholder="Masukkan nomor hp anda">
      </div>

      <div class="mb-6">
        <label class="block text-sm">Alamat pengantaran *</label>
        <textarea v-model="address" required class="w-full mt-1 border border-gray-300 px-3 py-2 rounded text-sm" placeholder="Masukkan alamat domisili anda"></textarea>
      </div>

      <button type="submit" :disabled="loading" class="w-full bg-[#3C5647] text-white py-2 rounded">
        {{ loading ? 'Registering...' : 'Register' }}
      </button>

      <p v-if="error" class="mt-4 text-red-500 text-sm text-center">{{ error }}</p>
    </form>
    <div class="mt-6 text-center text-sm text-gray-600">
        <p>
          Sudah punya akun?
          <router-link to="/login" class="text-[#814C3C] font-semibold hover:underline">Login</router-link>
        </p>
        <p class="mt-2">
          Admin?
          <router-link to="/admin-login" class="text-[#814C3C] font-semibold hover:underline">Login di sini</router-link>
        </p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.text-brown-700 {
  color: #78350f;
}

.bg-brown-700 {
  background-color: #78350f;
}

.hover\:text-brown-600:hover {
  color: #92400e;
}

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