<script setup>
import { onMounted, computed, ref } from 'vue';
import { useOrdersStore } from '../stores/ordersStore';
import { useMenuStore } from '../stores/menuStore';

const ordersStore = useOrdersStore();
const menuStore = useMenuStore();

// Komputasi statistik untuk dashboard
const totalOrders = computed(() => ordersStore.orders.length);

const activeOrders = computed(() => ordersStore.activeOrders.length);

const totalMenuItems = computed(() => menuStore.menuItems.length);

// Pendapatan hari ini: Filter pesanan yang selesai dan dari hari ini
const dailyRevenue = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize ke awal hari

  return ordersStore.orders
    .filter(order => {
      // Menggunakan 'createdAt' dari objek order yang dikembalikan controller admin
      const orderDate = new Date(order.createdAt);
      return (
        order.status === 'Selesai' && // Menggunakan status 'Selesai' (sesuai validasi di AdminOrderController)
        orderDate >= today && orderDate < new Date(today).setDate(today.getDate() + 1)
      );
    })
    // Menggunakan 'total' dari objek order yang dikembalikan controller admin
    .reduce((sum, order) => sum + parseFloat(order.total || 0), 0);
});

// Pesanan terbaru: 5 pesanan terakhir berdasarkan tanggal
const recentOrders = computed(() => {
  if (!ordersStore.orders || ordersStore.orders.length === 0) return [];
  // Menggunakan 'createdAt' untuk sorting
  return [...ordersStore.orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);
});

// Pengunjung Bulanan (placeholder)
const monthlyVisitors = ref('N/A');

// Ambil data saat komponen di-mount
onMounted(async () => {
  await ordersStore.fetchAdminOrders(); // Memanggil action untuk admin
  await menuStore.fetchMenuItems();
});
</script>

<template>
  <div class="space-y-8 p-4 md:p-8">
    <h2 class="text-3xl font-extrabold text-gray-800 border-b pb-4 mb-6">Admin Dashboard Overview</h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105">
        <h3 class="font-semibold text-lg text-gray-700 mb-2">Total Pesanan</h3>
        <p class="text-5xl font-bold text-[#814C3C]">{{ totalOrders }}</p>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105">
        <h3 class="font-semibold text-lg text-gray-700 mb-2">Pesanan Aktif</h3>
        <p class="text-5xl font-bold text-orange-500">{{ activeOrders }}</p>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105">
        <h3 class="font-semibold text-lg text-gray-700 mb-2">Jumlah Menu</h3>
        <p class="text-5xl font-bold text-blue-600">{{ totalMenuItems }}</p>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105">
        <h3 class="font-semibold text-lg text-gray-700 mb-2">Pendapatan Hari Ini</h3>
        <p class="text-3xl font-bold text-green-600">Rp {{ dailyRevenue.toLocaleString('id-ID') }}</p>
      </div>

       <div class="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105">
        <h3 class="font-semibold text-lg text-gray-700 mb-2">Pengunjung Bulanan</h3>
        <p class="text-5xl font-bold text-purple-600">{{ monthlyVisitors }}</p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl shadow-lg">
      <h3 class="font-semibold text-xl text-gray-700 mb-4 border-b pb-2">Pesanan Terbaru</h3>
      <ul class="divide-y divide-gray-200">
        <li v-for="order in recentOrders" :key="order.id" class="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div class="mb-2 sm:mb-0">
            <p class="font-medium text-gray-900 text-lg">
              Order #{{ String(order.id).substring(0, 8).toUpperCase() }}
            </p>
            <p class="text-sm text-gray-500">
              Customer: {{ order.form.namaLengkap || 'N/A' }} | Total: Rp {{ parseFloat(order.total || 0).toLocaleString('id-ID') }}
            </p>
            <p class="text-xs text-gray-400 mt-1">
              Dibuat: {{ new Date(order.createdAt).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
            </p>
          </div>
          <span class="px-3 py-1 text-sm font-semibold rounded-full min-w-[100px] text-center"
                :class="{
                  'bg-green-100 text-green-800': order.status === 'Selesai',
                  'bg-yellow-100 text-yellow-800': order.status === 'Dipesan' || order.status === 'Disiapkan',
                  'bg-blue-100 text-blue-800': order.status === 'Dikirim',
                  'bg-red-100 text-red-800': order.status === 'Dibatalkan'
                }">
            {{ order.status }}
          </span>
        </li>
        <li v-if="recentOrders.length === 0 && !ordersStore.isLoading" class="py-3 text-center text-gray-500">
          Tidak ada pesanan terbaru.
        </li>
        <li v-if="ordersStore.isLoading" class="py-3 text-center text-gray-500">
          Memuat pesanan terbaru...
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* Tidak ada styling khusus yang dibutuhkan di sini */
</style>