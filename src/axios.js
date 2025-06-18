// src/axios.js
import axios from 'axios'
import router from './router'

const axiosClient = axios.create({
  baseURL: 'http://localhost:8000/api', 
  headers: {
    Accept: 'application/json',
  },
  //withCredentials: true, // Anda bisa hapus baris ini
})

// Set the Authorization header before each request
axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token') // <-- PASTIKAN INI 'token'
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 globally
axiosClient.interceptors.response.use(
  response => response,
  error => {
     if (error.response && error.response.status === 401) {
      localStorage.removeItem('token') // <-- PASTIKAN INI 'token'
      localStorage.removeItem('user'); 
      localStorage.removeItem('isAdminLoggedIn');
      router.push('/login')
     }
    return Promise.reject(error)
  }
)

export default axiosClient