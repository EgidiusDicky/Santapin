// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)

// Fetch current user if token exists
import { useAuthStore } from '@/stores/authStore'
const auth = useAuthStore()
if (auth.token) auth.fetchUser()

app.mount('#app')
