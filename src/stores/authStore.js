import { defineStore } from 'pinia'
import axios from '@/axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')
  const role = ref(localStorage.getItem('role') || '')
  const error = ref('')
  const loading = ref(false)

  const setAuth = (data) => {
    token.value = data.token
    role.value = data.user.role
    user.value = data.user
    localStorage.setItem('token', token.value)
    localStorage.setItem('role', role.value)
  }

  const clearAuth = () => {
    token.value = ''
    role.value = ''
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('role')
  }

  const login = async (credentials) => {
    loading.value = true
    error.value = ''
    try {
      const res = await axios.post('/api/login', credentials)
      setAuth(res.data)
      loading.value = false

      if (role.value === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/')
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Login failed'
      loading.value = false
    }
  }

  const register = async (data) => {
    loading.value = true
    error.value = ''
    try {
      const res = await axios.post('/api/register', data)
      setAuth(res.data)
      loading.value = false
      router.push('/')
    } catch (err) {
      error.value = err.response?.data?.message || 'Registration failed'
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await axios.post('/api/logout', {}, {
        headers: { Authorization: `Bearer ${token.value}` }
      })
    } catch (e) {
      // ignore
    } finally {
      clearAuth()
      router.push('/login')
    }
  }

  return {
    user,
    token,
    role,
    error,
    loading,
    login,
    register,
    logout
  }
})
