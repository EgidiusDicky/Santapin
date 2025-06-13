import axios from 'axios'
import router from './router'

const axiosClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Important: add `/api` if using api.php routes
})

// Set the Authorization header before each request
axiosClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken')
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
      localStorage.removeItem('authToken')
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default axiosClient
