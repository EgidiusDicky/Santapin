<script setup>
import { ref, computed, onMounted, watch } from 'vue' // Import onMounted and watch
import { useOrdersStore } from '@/stores/ordersStore'
import { useAuthStore } from '@/stores/authStore' // Import useAuthStore for authentication checks

const ordersStore = useOrdersStore()
const authStore = useAuthStore() // Initialize authStore

const searchQuery = ref('')
const sortBy = ref('newest')

// Watch for authentication status changes to fetch orders
watch(() => authStore.isAuthenticated, (isAuthenticated) => {
    if (isAuthenticated) {
        ordersStore.fetchAdminOrders() // Call the admin-specific fetch function
    } else {
        // Clear orders and set error state if not authenticated
        ordersStore.orders = [];
        ordersStore.error = 'NOT_AUTHENTICATED';
        ordersStore.isLoading = false; // Ensure loading state is false
    }
}, { immediate: true }) // immediate: true ensures it runs on component mount

const filteredOrders = computed(() => {
    // Ensure ordersStore.orders is an array before filtering
    if (!ordersStore.orders || !Array.isArray(ordersStore.orders)) {
        return [];
    }
    return ordersStore.orders.filter(order => {
        const idMatch = order.id && order.id.toString().toLowerCase().includes(searchQuery.value.toLowerCase());
        const nameMatch = order.form && order.form.namaLengkap && order.form.namaLengkap.toLowerCase().includes(searchQuery.value.toLowerCase());
        return idMatch || nameMatch;
    });
});

const sortedOrders = computed(() => {
    let sorted = [...filteredOrders.value]; // Create a shallow copy to avoid mutating original array
    if (sortBy.value === 'newest') {
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy.value === 'status') {
        // Define a custom sort order for statuses for better admin view
        const statusOrder = {
            'Dipesan': 1,
            'Disiapkan': 2,
            'Dikirim': 3,
            'Dibatalkan': 4, // Canceled orders often come before completed ones for attention
            'Selesai': 5
        };
        return sorted.sort((a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99));
    }
    return sorted;
});

const updateStatus = async (order) => {
    try {
        await ordersStore.updateOrderStatus(order.id, order.status);
        // The store handles optimistic update, so no need to manually change order.status here again
    } catch (error) {
        console.error("Failed to update status:", error);
        // Optionally, fetch orders again to ensure UI consistency if optimistic update failed
        ordersStore.fetchAdminOrders();
    }
};

const cancelOrder = async (order) => {
    const originalStatus = order.status; // Store original status for revert
    order.status = 'Dibatalkan'; // Optimistic update
    try {
        await ordersStore.updateOrderStatus(order.id, 'Dibatalkan');
    } catch (error) {
        console.error("Failed to cancel order:", error);
        order.status = originalStatus; // Revert if API call fails
    }
};

const completeOrder = async (order) => {
    const originalStatus = order.status; // Store original status for revert
    order.status = 'Selesai'; // Optimistic update
    try {
        await ordersStore.updateOrderStatus(order.id, 'Selesai');
    } catch (error) {
        console.error("Failed to complete order:", error);
        order.status = originalStatus; // Revert if API call fails
    }
};

const confirmOrder = async (id) => {
    const order = ordersStore.orders.find(o => o.id === id);
    if (order && order.status === 'Dipesan') {
        const originalStatus = order.status; // Store original status for revert
        order.status = 'Disiapkan'; // Optimistic update
        try {
            await ordersStore.updateOrderStatus(order.id, 'Disiapkan');
        } catch (error) {
            console.error("Failed to confirm order:", error);
            order.status = originalStatus; // Revert if API call fails
        }
    }
};
</script>

<template>
  <div class="body flex-grow py-6 px-5"> <div class="bg-white shadow-md sticky top-0 z-10 p-6 rounded-sm mb-6"> <h2 class="text-2xl font-semibold mb-4">Manajemen Pesanan</h2>

      <div class="flex flex-wrap justify-between items-center gap-4 mb-4"> <input
          v-model="searchQuery"
          placeholder="Cari nama atau ID..."
          class="p-2 rounded border w-full md:w-1/2" />
        <select v-model="sortBy" class="p-2 border rounded w-full md:w-auto"> <option value="newest">Terbaru</option>
          <option value="status">Status</option>
        </select>
      </div>
    </div>

    <div v-if="ordersStore.isLoading" class="text-center py-10 text-gray-600">
      <p>Memuat semua pesanan...</p>
    </div>

    <div v-else-if="!authStore.isAuthenticated" class="text-center py-10 text-red-600">
      <p>Anda harus login untuk melihat dan mengelola pesanan.</p>
      <router-link to="/login" class="text-blue-600 hover:underline">Klik di sini untuk Login</router-link>
    </div>

    <div v-else-if="ordersStore.error === 'NOT_AUTHENTICATED'" class="text-center py-10 text-red-600">
        <p>Anda tidak memiliki akses untuk melihat pesanan admin. Silakan login dengan akun yang sesuai.</p>
        <router-link to="/login" class="text-blue-600 hover:underline">Klik di sini untuk Login</router-link>
    </div>

    <div v-else-if="ordersStore.error" class="text-center py-10 text-red-600">
      <p>Terjadi kesalahan: {{ ordersStore.error }}</p>
      <p>Tidak dapat memuat pesanan. Silakan coba lagi nanti.</p>
    </div>

    <div v-else-if="sortedOrders.length === 0" class="text-center py-10 text-gray-500">
      <p>Tidak ada pesanan yang ditemukan.</p>
    </div>

    <div v-else v-for="order in sortedOrders" :key="order.id" class="bg-white p-4 rounded shadow my-4">
      <details>
        <summary class="cursor-pointer font-semibold">
          Order #{{ order.id }} - {{ order.form.namaLengkap }}
        </summary>

        <p class="text-sm text-gray-500">Dibuat: {{ new Date(order.createdAt).toLocaleString('id-ID') }}</p>
        <p class="text-sm text-gray-500">Status: {{ order.status }}</p>

        <div class="mt-2">
          <label class="text-sm mr-2">Ubah Status:</label>
          <select v-model="order.status" @change="updateStatus(order)" class="p-1 border rounded">
            <option value="Dipesan">Dipesan</option>
            <option value="Disiapkan">Disiapkan</option>
            <option value="Dikirim">Dikirim</option>
            <option value="Selesai">Selesai</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>
        </div>
        
        <div class="mt-2 space-x-2">
          <button 
            v-if="order.status !== 'Dibatalkan' && order.status !== 'Selesai'" 
            @click="cancelOrder(order)" 
            class="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Batalkan
          </button>
          <button 
            v-if="order.status !== 'Selesai' && order.status !== 'Dibatalkan'" 
            @click="completeOrder(order)" 
            class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Selesaikan
          </button>
          <button 
            v-if="order.status === 'Dipesan'" 
            @click="confirmOrder(order.id)" 
            class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Konfirmasi
          </button>
        </div>

        <div class="mt-4">
          <p class="text-sm text-gray-500">Alamat: {{ order.form.alamatPengantaran }}</p>
          <ul class="text-sm mt-2">
            <li v-for="(item, itemIndex) in order.items" :key="itemIndex"> - {{ item.name }} x{{ item.quantity }}
            </li>
          </ul>
          <p class="text-sm font-bold mt-2">Total: Rp {{ order.total.toLocaleString('id-ID') }}</p>
        </div>
      </details>
    </div>
  </div>
</template>

<style scoped>
.body {
  background-color: whitesmoke;
}

summary::-webkit-details-marker {
  display: none;
}
summary {
  list-style: none;
}
</style>