<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/ordersStore'

const route = useRoute()
const router = useRouter()
const ordersStore = useOrdersStore()

const orderId = computed(() => route.params.id)
const order = computed(() => ordersStore.currentOrder)

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/orders')
  }
}

// Pastikan status ini konsisten dengan backend Anda
const statusStepMap = {
  'Dipesan': 0,
  'Disiapkan': 1,
  'Dikirim': 2,
  'Selesai': 3
}

const steps = [
  { label: 'Dipesan' },
  { label: 'Disiapkan' },
  { label: 'Dikirim' },
  { label: 'Selesai' }
]

const currentStep = computed(() => {
  return statusStepMap[order.value?.status] ?? 0
})

onMounted(async () => {
  if (orderId.value && !isNaN(Number(orderId.value))) {
    await ordersStore.fetchOrderById(Number(orderId.value))
  } else {
    ordersStore.error = "ID pesanan tidak valid."
  }
})
</script>

<template>
  <body class="body">
    <div class="flex items-center justify-between px-6 py-4 shadow-md bg-white sticky top-0 z-50">
      <div class="relative z-10 w-full max-w-6xl mx-auto">
        <button class="flex space-x-2 items-center" @click="goBack">
          <img src="../asset/Back arrow icon.svg" alt="Back" class="w-6 h-6">
          <h2 class="text-lg font-semibold text-gray-700">Kembali</h2>
        </button>
      </div>
    </div>

    <section class="px-5">
      <div class="max-w-6xl mx-auto py-6">
        <h2 class="md:text-2xl font-bold text-gray-800 mb-4">Detail Pesanan</h2>

        <div v-if="ordersStore.isLoading" class="text-center py-10 text-gray-600">
          <p>Memuat detail pesanan...</p>
          <svg class="animate-spin h-8 w-8 text-gray-400 mx-auto mt-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>

        <div v-else-if="ordersStore.error" class="text-center py-10 text-red-600">
          <p>Terjadi kesalahan: {{ ordersStore.error }}</p>
          <p>Tidak dapat memuat detail pesanan ini.</p>
          <button @click="ordersStore.fetchOrderById(orderId)" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Coba Lagi</button>
        </div>

        <div v-else-if="!order" class="text-center py-10 text-gray-500">
          <p>Pesanan tidak ditemukan.</p>
        </div>

        <div v-else>
          <div class="md:grid max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg mb-3">
            <div class="space-y-4">
              <div class="items-center justify-between">
                <div class="items-center space-x-4 space-y-4">
                  <div class="flex items-center justify-between">
                    <div class="flex">
                      <h2 class="pr-4 font-bold text-gray-700">#{{ order.id }}</h2>
                      <p class="text-gray-500">{{ new Date(order.createdAt).toLocaleString('id-ID') }}</p>
                    </div>
                    <div>
                      <p class="py-2 text-gray-500">Estimasi 15-30 menit</p>
                    </div>
                  </div>
                  <div class="mt-2 text-sm text-gray-600 space-y-1">
                    <p><strong>Nama:</strong> {{ order.form?.namaLengkap || '-' }}</p>
                    <p><strong>No. HP:</strong> {{ order.form?.nomorHp || '-' }}</p>
                    <p><strong>Alamat:</strong> {{ order.form?.alamatPengantaran || '-' }}</p>
                    <p><strong>Catatan Dapur:</strong> {{ order.form?.pesanUntukDapur || '-' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg mb-3">
            <div class="relative flex justify-between items-center py-10">
              <div class="absolute top-1/2 left-4 right-4 h-1 bg-gray-300 transform -translate-y-1/2 z-0"></div>

              <div
                v-if="steps.length > 1"
                class="absolute top-1/2 left-4 h-1 bg-[#3D5943] transform -translate-y-1/2 z-0 transition-all duration-500 ease-in-out"
                :style="{ width: `${(currentStep / (steps.length - 1)) * 100}%` }"
              ></div>

              <div
                v-for="(step, index) in steps"
                :key="index"
                class="flex flex-col items-center text-center z-10 w-fit"
              >
                <div
                  class="text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 border-4"
                  :class="{
                    'bg-[#3D5943] border-[#3D5943]': index <= currentStep, // Active/completed step (green bg, green border)
                    'bg-white border-gray-300': index > currentStep, // Inactive step (white bg, gray border)
                  }"
                >
                  <span v-if="index <= currentStep">✓</span>
                  <span v-else class="h-2 w-2 rounded-full bg-gray-300"></span>
                </div>
                <span
                  class="mt-2 text-sm whitespace-nowrap"
                  :class="index <= currentStep ? 'text-[#3D5943] font-semibold' : 'text-gray-400'"
                >{{ step.label }}</span>
                <span class="text-xs text-gray-400">–</span>
              </div>
            </div>
          </div>

          <div class="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg mb-3">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Ringkasan pesanan</h2>
            <div class="space-y-2">
              <div
                v-for="(item, index) in order.items"
                :key="index"
                class="flex justify-between"
              >
                <span>{{ item.name }} x{{ item.quantity }}</span>
                <span>Rp {{ (item.price * item.quantity).toLocaleString('id-ID') }}</span>
              </div>

              <div class="flex justify-between">
                <span>Ongkir</span>
                <span>Rp {{ order.ongkir?.toLocaleString('id-ID') || '0' }}</span>
              </div>
              <div class="flex justify-between">
                <span>Biaya admin</span>
                <span>Rp {{ order.biayaAdmin?.toLocaleString('id-ID') || '0' }}</span>
              </div>
              <div class="flex justify-between font-bold">
                <span>Total</span>
                <span>Rp {{ order.total?.toLocaleString('id-ID') || '0' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </body>
</template>

<style scoped>
.body{
  background-color: whitesmoke;
}
</style>