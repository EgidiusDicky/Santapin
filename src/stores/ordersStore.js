// src/stores/ordersStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axiosClient from '@/axios'
import { useAuthStore } from './authStore'

export const useOrdersStore = defineStore('orders', () => {
    const orders = ref([])
    const lastOrder = ref(null)
    const currentOrder = ref(null)
    const isLoading = ref(false)
    const error = ref(null)

    const authStore = useAuthStore() // Initialize authStore

    const activeOrders = computed(() => {
        if (!orders.value) return []
        return orders.value.filter(order =>
            ['Dipesan', 'Disiapkan', 'Dikirim', 'Pesanan Selesai'].includes(order.status)
        )
    })

    const pastOrders = computed(() => {
        if (!orders.value) return []
        return orders.value.filter(order => order.status === 'Selesai')
    })

    async function placeOrder(orderData) {
        isLoading.value = true
        error.value = null

        try {
            // Check auth status from store before making request
            if (!authStore.isAuthenticated) {
                error.value = 'BELUM LOGIN';
                isLoading.value = false;
                throw new Error('User not authenticated. Please log in to place an order.');
            }

            // Kirim data pesanan ke server
            const response = await axiosClient.post('/orders', orderData)
            const backendOrder = response.data.data; // Data yang dikembalikan server (misal: berisi id, status)

            // --- PERUBAHAN UTAMA ADA DI SINI ---
            // Kita gabungkan data yang kita KIRIM (orderData) dengan data yang kita TERIMA (backendOrder)
            // Ini memastikan semua rincian harga yang sudah dihitung di frontend ikut tersimpan.
            lastOrder.value = {
                ...orderData, // Salin semua data dari checkout (termasuk subtotal, total, dll)
                id: backendOrder.id, // Ambil ID asli dari server
                status: backendOrder.status, // Ambil status dari server
                order_items: backendOrder.order_items || orderData.items.map(item => ({...item, product_name: item.name})), // Pastikan item ada dan memiliki nama produk
                estimated_delivery_time: backendOrder.estimated_delivery_time || '15 - 30 menit'
            };
            
            console.log('lastOrder object constructed for receipt:', lastOrder.value);

            isLoading.value = false
            return lastOrder.value; // Kembalikan objek gabungan yang lengkap

        } catch (err) {
            isLoading.value = false
            // Let axiosClient interceptor handle 401 and logout.
            // Here, we just set the error for the component to display.
            error.value = err.response ? err.response.data.message : err.message;
            console.error('Error placing order via store:', err)
            throw err // Re-throw to allow component-level handling if needed
        }
    }

    async function fetchUserOrders() {
        isLoading.value = true
        error.value = null

        try {
            if (!authStore.isAuthenticated) {
                error.value = 'BELUM LOGIN';
                orders.value = [];
                isLoading.value = false;
                return;
            }

            const response = await axiosClient.get('/orders')

            // --- PERUBAHAN UTAMA DI SINI ---
            // Modifikasi data yang diterima dari API untuk menambahkan 'id' ke setiap item
            const processedOrders = response.data.data.map(order => {
                const processedItems = order.items.map((item, index) => {
                    // Gunakan ID unik dari database jika tersedia, jika tidak, gunakan index sebagai fallback
                    // PERHATIKAN: Sebaiknya backend mengembalikan ID produk yang sebenarnya.
                    return { ...item, id: item.product_id || index + 1 };
                });
                return { ...order, items: processedItems };
            });
            
            orders.value = processedOrders;
            console.log('User orders fetched and processed:', orders.value);
            isLoading.value = false
        } catch (err) {
            isLoading.value = false
            // Let axiosClient interceptor handle 401 and logout.
            error.value = err.response ? err.response.data.message : 'Failed to load user orders. Please try again later.';
            console.error('Error fetching user orders:', err)
        }
    }

    async function fetchOrderById(orderId) {
        isLoading.value = true
        error.value = null
        currentOrder.value = null

        try {
            if (!authStore.isAuthenticated) {
                error.value = 'BELUM LOGIN';
                isLoading.value = false;
                throw new Error('User not authenticated. Please log in to view order details.');
            }

            const response = await axiosClient.get(`/orders/${orderId}`)
            
            currentOrder.value = response.data.data
            console.log('Order details fetched:', currentOrder.value);
            isLoading.value = false
        } catch (err) {
            isLoading.value = false
            // Let axiosClient interceptor handle 401 and logout.
            error.value = err.response?.data?.message || `Error fetching order ${orderId}.`;
            console.error(`Error fetching order ${orderId}:`, err)
            throw err
        }
    }

    async function fetchAdminOrders() {
        isLoading.value = true;
        error.value = null;

        try {
            // Check auth status from store before making request
            if (!authStore.isAuthenticated) { // Or check for specific admin role here: !authStore.isAdmin
                error.value = 'BELUM LOGIN';
                orders.value = [];
                isLoading.value = false;
                console.log('Admin not authenticated, cannot fetch all orders.');
                return;
            }

            const response = await axiosClient.get('/admin/orders'); // Adjust endpoint if different
            orders.value = response.data.data;
            console.log('Admin orders fetched:', orders.value);
            isLoading.value = false;
        } catch (err) {
            isLoading.value = false;
            // Let axiosClient interceptor handle 401 and logout.
            error.value = err.response?.data?.message || 'Failed to fetch all orders for admin.';
            console.error('Error fetching admin orders:', err);
            throw err;
        }
    }

    async function updateOrderStatus(orderId, newStatus) {
        isLoading.value = true;
        error.value = null;

        try {
            // Check auth status from store before making request
            if (!authStore.isAuthenticated) { // Or check for specific admin role: !authStore.isAdmin
                error.value = 'BELUM LOGIN';
                isLoading.value = false;
                throw new Error('User not authenticated to update order status.');
            }

            const response = await axiosClient.patch(`/admin/orders/${orderId}/status`, { status: newStatus });

            const index = orders.value.findIndex(o => o.id == orderId);
            if (index !== -1) {
                orders.value[index].status = newStatus;
            }

            console.log(`Order ${orderId} status updated to ${newStatus}.`);
            isLoading.value = false;
            return response.data;

        } catch (err) {
            isLoading.value = false;
            // Let axiosClient interceptor handle 401 and logout.
            error.value = err.response?.data?.message || 'Failed to update order status.';
            console.error(`Error updating status for order ${orderId}:`, err);
            throw err;
        }
    }

    function clearLastOrder() {
        lastOrder.value = null
    }

    function clearCurrentOrder() {
        currentOrder.value = null
    }

    return {
        orders,
        lastOrder,
        currentOrder,
        isLoading,
        error,
        activeOrders,
        pastOrders,
        placeOrder,
        fetchUserOrders,
        fetchOrderById,
        fetchAdminOrders,
        updateOrderStatus,
        clearLastOrder,
        clearCurrentOrder,
    }
}, {
    persist: {
        paths: ['lastOrder', 'currentOrder'],
    }
})
