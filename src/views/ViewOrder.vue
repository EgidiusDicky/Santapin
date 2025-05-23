<script setup>
import { ref, computed } from 'vue'
import { useOrdersStore } from '@/stores/ordersStore'

const ordersStore = useOrdersStore()

const searchQuery = ref('')
const sortBy = ref('newest')

const filteredOrders = computed(() =>
  ordersStore.orders.filter(order =>
    order.id.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    order.form.namaLengkap.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

const sortedOrders = computed(() => {
  let sorted = [...filteredOrders.value]
  if (sortBy.value === 'newest') {
    return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sortBy.value === 'status') {
    return sorted.sort((a, b) => a.status.localeCompare(b.status))
  }
  return sorted
})

const updateStatus = (order) => {
  ordersStore.updateOrderStatus(order.id, order.status)
}

const cancelOrder = (order) => {
  order.status = 'Dibatalkan'
  updateStatus(order)
}

const completeOrder = (order) => {
  order.status = 'Selesai'
  updateStatus(order)
}

const confirmOrder = (id) => {
  const order = ordersStore.orders.find(o => o.id === id)
  if (order && order.status === 'Dipesan') {
    order.status = 'Disiapkan'
  }
}
</script>

<template>
    <div class="body flex-grow py-6">

    <div class="bg-white shadow-md sticky top-0 z-10 p-6 rounded-sm">
      <h2 class="text-2xl font-semibold mb-4">Manajemen Pesanan</h2>

      <div class="flex justify-between items-center mb-4">
        <input
          v-model="searchQuery"
          placeholder="Cari nama atau ID..."
          class="p-2 rounded border w-1/2"
        />
        <select v-model="sortBy" class="p-2 border rounded">
          <option value="newest">Terbaru</option>
          <option value="status">Status</option>
        </select>
      </div>
    </div>

      <div v-for="order in sortedOrders" :key="order.id" class="bg-white p-4 rounded shadow my-4">
        <details>
          <summary class="cursor-pointer font-semibold">Order #{{ order.id }} - {{ order.form.namaLengkap }}</summary>

          <p class="text-sm text-gray-500">Dibuat: {{ new Date(order.createdAt).toLocaleString() }}</p>
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
            <button v-if="order.status !== 'Dibatalkan'" @click="cancelOrder(order)" class="text-red-600">Batalkan</button>
            <button v-if="order.status !== 'Selesai'" @click="completeOrder(order)" class="text-green-600">Selesaikan</button>
          </div>

          <div class="mt-4">
            <p class="text-sm text-gray-500">Alamat: {{ order.form.alamatPengantaran }}</p>
            <ul class="text-sm mt-2">
              <li v-for="item in order.items" :key="item.id">
                - {{ item.name }} x{{ item.quantity }}
              </li>
            </ul>
            <p class="text-sm font-bold mt-2">Total: Rp {{ order.total }}</p>
          </div>
        </details>
      </div>
    </div>
</template>

<style scoped>
.body{
    background-color: whitesmoke;
}

summary::-webkit-details-marker {
  display: none;
}
summary {
  list-style: none;
}
</style>
