<script setup>
import { useOrdersStore } from '@/stores/ordersStore'
import { computed, onBeforeUnmount, onMounted } from 'vue' // Import onMounted

const ordersStore = useOrdersStore()

// Panggil fetchUserOrders saat komponen dimuat
onMounted(() => {
  ordersStore.fetchUserOrders()
})

// Optionally disconnect WebSocket if store uses one
onBeforeUnmount(() => {
  if (ordersStore.disconnectSocket) {
    ordersStore.disconnectSocket()
  }
})

const activeOrders = computed(() =>
  ordersStore.orders.filter(order =>
    ['Dipesan', 'Disiapkan', 'Dikirim', 'Pesanan Selesai'].includes(order.status)
  )
)

const pastOrders = computed(() =>
  ordersStore.orders.filter(order => order.status === 'Selesai')
)

const getStatusBadge = (status) => {
  const statusMap = {
    Dipesan: { label: 'Dipesan', bg: 'bg-[#814C3C]' },
    Disiapkan: { label: 'Disiapkan', bg: 'bg-orange-500' },
    Dikirim: { label: 'Dikirim', bg: 'bg-blue-500' },
    Selesai: { label: 'Pesanan Selesai', bg: 'bg-[#3D5943]' }
  }
  return statusMap[status] || { label: status, bg: 'bg-gray-400' }
}
</script>

<template>
  <main class="bg-[whitesmoke] px-5">
    <section class="max-w-6xl mx-auto py-6">
      <h2 class="md:text-2xl font-bold text-gray-800 mb-4">Pesanan Aktif</h2>

      <div v-if="ordersStore.isLoading" class="text-center py-10 text-gray-600">
        <p>Memuat pesanan Anda...</p>
        </div>

      <div v-else-if="ordersStore.error" class="text-center py-10 text-red-600">
        <p>Terjadi kesalahan: {{ ordersStore.error }}</p>
        <p>Tidak dapat memuat pesanan. Silakan coba lagi nanti.</p>
      </div>

      <div v-else-if="activeOrders.length === 0" class="text-center py-10 text-gray-500">
        <p>Anda belum memiliki pesanan aktif saat ini.</p>
        <router-link to="/menu" class="text-blue-600 hover:underline">Jelajahi menu kami!</router-link>
      </div>

      <router-link
        v-else
        v-for="order in activeOrders"
        :key="order.id"
        :to="`/orders-tracking/${order.id}`"
        class="block"
      >
        <div class="p-6 bg-white rounded-lg shadow-md mb-3 hover:shadow-xl transition">
          <div class="space-y-4">
            <div class="flex flex-wrap justify-between items-center gap-2 md:gap-4">
              <div class="min-w-0">
                <div class="flex gap-2 items-center text-sm text-gray-500">
                  <h2 class="font-bold text-gray-700 truncate">#{{ order.id }}</h2>
                  <p>{{ new Date(order.createdAt).toLocaleString('id-ID') }}</p>
                </div>
                <p class="text-gray-500 text-sm truncate">
                  {{ order.items.map(i => `${i.name} x${i.quantity}`).join(', ') }}
                </p>
              </div>

              <div class="flex items-center gap-2 md:gap-4">
                <h2 class="text-sm md:text-base font-bold text-[#814C3C] whitespace-nowrap">
                  Rp{{ order.total.toLocaleString('id-ID') }}
                </h2>
                <div
                  class="px-3 py-1 text-xs md:text-sm rounded-full text-white whitespace-nowrap"
                  :class="getStatusBadge(order.status).bg"
                >
                  {{ getStatusBadge(order.status).label }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </router-link>
    </section>

    <section class="max-w-6xl mx-auto pb-6">
      <h2 class="md:text-2xl font-bold text-gray-800 mb-4">Pesanan Sebelumnya</h2>

      <div v-if="ordersStore.isLoading">
        </div>
      <div v-else-if="ordersStore.error">
         </div>
      <div v-else-if="pastOrders.length === 0" class="text-center py-10 text-gray-500">
        <p>Anda belum memiliki riwayat pesanan.</p>
      </div>

      <router-link
        v-else
        v-for="order in pastOrders"
        :key="order.id"
        :to="`/orders-tracking/${order.id}`"
        class="block"
      >
        <div class="p-6 bg-white rounded-lg shadow-lg mb-3 hover:shadow-xl transition">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="flex gap-4">
                  <h2 class="font-bold text-gray-700">#{{ order.id }}</h2>
                  <p class="text-gray-500">{{ new Date(order.createdAt).toLocaleString('id-ID') }}</p>
                </div>
                <p class="text-gray-500">
                  {{ order.items.map(i => `${i.name} x${i.quantity}`).join(', ') }}
                </p>
              </div>
              <div class="flex items-center gap-4">
                <h2 class="font-bold text-[#814C3C]">Rp{{ order.total.toLocaleString('id-ID') }}</h2>
                <div class="py-1 px-6 text-lg rounded-full bg-[#3D5943] text-white">Selesai</div>
              </div>
            </div>
          </div>
        </div>
      </router-link>
    </section>
  </main>
</template>

<style scoped>
.body{
  background-color: whitesmoke;
}
</style>