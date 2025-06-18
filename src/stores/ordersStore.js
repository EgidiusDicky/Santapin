import { defineStore } from 'pinia'
import { ref, computed } from 'vue' // Import computed
import axiosClient from 'axios'
import { useAuthStore } from './authStore' // Pastikan Anda memiliki authStore

export const useOrdersStore = defineStore('orders', () => {
    // orders akan menyimpan daftar pesanan yang diambil dari backend (untuk halaman riwayat)
    const orders = ref([])
    // lastOrder akan menyimpan detail pesanan yang baru saja berhasil dibuat
    const lastOrder = ref(null)
    // currentOrder akan menyimpan detail pesanan yang sedang dilihat di halaman tracking
    const currentOrder = ref(null)
    const isLoading = ref(false)
    const error = ref(null)

    // Getter untuk memfilter pesanan aktif
    const activeOrders = computed(() => {
        // Pastikan orders adalah array sebelum memanggil filter
        if (!orders.value) return []
        return orders.value.filter(order =>
            ['Dipesan', 'Disiapkan', 'Dikirim'].includes(order.status)
        )
    })

    // Getter untuk memfilter pesanan sebelumnya
    const pastOrders = computed(() => {
        // Pastikan orders adalah array sebelum memanggil filter
        if (!orders.value) return []
        return orders.value.filter(order => order.status === 'Selesai')
    })

    /**
     * Mengirim data pesanan ke backend API.
     * @param {Object} orderData - Data pesanan dari formulir checkout.
     * @returns {Promise<Object>} Respon data pesanan dari backend.
     */
    async function placeOrder(orderData) {
        isLoading.value = true
        error.value = null
        const authStore = useAuthStore()

        try {
            if (!authStore.token) {
                throw new Error('User not authenticated. Please log in.');
            }

            const response = await axiosClient.post('http://localhost:8000/api/orders', orderData, {
                headers: {
                    Authorization: `Bearer ${authStore.token}`
                }
            })

            // Simpan pesanan yang baru dibuat dari respons backend
            // Asumsi backend merespons dengan { message: ..., data: { ...order_details... } }
            lastOrder.value = response.data.data // Sesuaikan jika response.data langsung order
            isLoading.value = false
            return response.data.data

        } catch (err) {
            isLoading.value = false
            error.value = err.response ? err.response.data.message : err.message
            console.error('Error placing order via store:', err)
            // Jika error otentikasi, paksa logout
            if (err.response && err.response.status === 401) {
                authStore.logout();
            }
            throw err // Re-throw error agar komponen pemanggil bisa menanganinya
        }
    }

    /**
     * Mengambil daftar pesanan untuk pengguna yang sedang login.
     * Metode ini akan berguna untuk halaman riwayat pesanan.
     */
    async function fetchUserOrders() {
        isLoading.value = true
        error.value = null
        const authStore = useAuthStore()

        try {
            if (!authStore.token) {
                throw new Error('User not authenticated. Please log in.');
            }

            const response = await axiosClient.get('http://localhost:8000/api/orders', {
                headers: {
                    Authorization: `Bearer ${authStore.token}`
                }
            })
            // Asumsi backend merespons dengan { data: [...] }
            orders.value = response.data.data // <--- Pastikan ini sesuai dengan struktur respons backend Anda
            console.log('User orders fetched:', orders.value);
            isLoading.value = false
        } catch (err) {
            isLoading.value = false
            error.value = err.response ? err.response.data.message : err.message
            console.error('Error fetching user orders:', err)
            // Jika error otentikasi, paksa logout
            if (err.response && err.response.status === 401) {
                authStore.logout();
            }
            throw err // Re-throw error agar komponen pemanggil bisa menanganinya
        }
    }

    /**
     * Mengambil detail satu pesanan berdasarkan ID.
     * @param {number} orderId - ID dari pesanan yang ingin diambil.
     */
    async function fetchOrderById(orderId) {
        isLoading.value = true
        error.value = null
        currentOrder.value = null // Bersihkan detail pesanan sebelumnya
        const authStore = useAuthStore()

        try {
            if (!authStore.token) {
                throw new Error('User not authenticated. Please log in.');
            }

            const response = await axiosClient.get(`http://localhost:8000/api/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${authStore.token}`
                }
            })
            // Asumsi backend merespons dengan { data: { ...order_details... } }
            currentOrder.value = response.data.data // <--- Pastikan ini sesuai dengan struktur respons backend Anda
            console.log('Order details fetched:', currentOrder.value);
            isLoading.value = false
        } catch (err) {
            isLoading.value = false
            error.value = err.response ? err.response.data.message : err.message
            console.error(`Error fetching order ${orderId}:`, err)
            // Jika error otentikasi, paksa logout
            if (err.response && err.response.status === 401) {
                authStore.logout();
            }
            throw err // Re-throw error agar komponen pemanggil bisa menanganinya
        }
    }

    // Mengosongkan lastOrder (misalnya setelah pengguna melihat halaman receipt)
    function clearLastOrder() {
        lastOrder.value = null
    }

    // Mengosongkan currentOrder (misalnya saat meninggalkan halaman tracking)
    function clearCurrentOrder() {
        currentOrder.value = null
    }

    // Anda bisa menambahkan fungsi disconnectSocket di sini jika menggunakan WebSocket
    // Contoh dummy:
    // function disconnectSocket() {
    //     console.log('Disconnecting WebSocket...');
    //     // Logika untuk memutuskan koneksi WebSocket
    // }

    return {
        orders,
        lastOrder,
        currentOrder, // Paparkan currentOrder agar bisa diakses komponen
        isLoading,
        error,
        activeOrders, // Paparkan computed properties
        pastOrders,   // Paparkan computed properties
        placeOrder,
        fetchUserOrders,
        fetchOrderById, // Paparkan metode baru
        clearLastOrder,
        clearCurrentOrder,
        // disconnectSocket, // Paparkan jika ada implementasinya
    }
}, {
    // `persist: true` bisa digunakan jika Anda ingin mempertahankan state di local storage.
    // Jika tidak, Anda bisa menghapusnya atau mengelola bagian mana yang di-persist.
    // Contoh hanya mempertahankan lastOrder dan currentOrder untuk sesaat:
    persist: {
        paths: ['lastOrder', 'currentOrder'],
        // Atau Anda bisa menggunakan serializer/deserializer jika data kompleks
        // Contoh:
        // serializer: {
        //     serialize: (state) => JSON.stringify(state),
        //     deserialize: (state) => JSON.parse(state),
        // }
    }
})