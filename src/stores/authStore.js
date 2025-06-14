import { defineStore } from 'pinia'
import axiosClient from '../axios'
import router from '../router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('authToken') || null,
    role: localStorage.getItem('userRole') || null,
    loading: false,
    error: null
  }),

  actions: {
    async login({ email, password, isAdmin = false }) {
      this.loading = true
      this.error = null

      const endpoint = isAdmin ? '/admin-login' : '/login'

      try {
        const res = await axiosClient.post(endpoint, { email, password })

        this.user = res.data.user
        this.token = res.data.token
        this.role = res.data.user.role

        localStorage.setItem('authToken', res.data.token)
        localStorage.setItem('userRole', res.data.user.role)

        // Redirect after login
        if (isAdmin) {
          router.push('/admin/dashboard')
        } else {
          router.push('/')
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Login failed.'
      } finally {
        this.loading = false
      }
    },

    async register({ name, email, password, password_confirmation, phone, address }) {
      this.loading = true
      this.error = null

      try {
        const res = await axiosClient.post('/register', {
          name, email, password, password_confirmation, phone, address
        })

        this.user = res.data.user
        this.token = res.data.token
        this.role = res.data.user.role

        localStorage.setItem('authToken', res.data.token)
        localStorage.setItem('userRole', res.data.user.role)

        router.push('/')
      } catch (err) {
        this.error = err.response?.data?.message || 'Registration failed.'
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await axiosClient.post('/logout')
      } catch (err) {
        console.error('Logout failed:', err)
      }

      this.user = null
      this.token = null
      this.role = null

      localStorage.removeItem('authToken')
      localStorage.removeItem('userRole')

      router.push('/login')
    },

    async fetchUser() {
      try {
        const res = await axiosClient.get('/me')
        this.user = res.data
        this.role = res.data.role
      } catch {
        this.logout()
      }
    }
  }
})
