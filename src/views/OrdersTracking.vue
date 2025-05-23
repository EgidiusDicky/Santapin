<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/ordersStore'

const route = useRoute()
const router = useRouter()

const ordersStore = useOrdersStore()
const orderId = computed(() => route.params.id)
const order = computed(() => ordersStore.getOrderById(orderId.value))

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/orders')
  }
}

const statusStepMap = {
  'Diterima': 0,
  'Disiapkan': 1,
  'Siap Diantar': 2,
  'Selesai': 3
}

const currentStep = computed(() => {
  return statusStepMap[order.value?.status] ?? 0
})

const steps = [
  { label: 'Dipesan' },
  { label: 'Disiapkan' },
  { label: 'Dikirim' },
  { label: 'Selesai' }
]
</script>

<template>
    <body class="body">
    <!-- Back Arrow Bar -->
    <div class="flex items-center justify-between px-6 py-4 shadow-md bg-white sticky top-0 z-50">
        <div class="relative z-10 w-full max-w-6xl mx-auto">
        <button class="flex space-x-2" @click="goBack">
            <img src="../asset/Back arrow icon.svg" alt="">
            <h2>Back</h2>
        </button>
        </div>
    </div>

        <section class="px-5">  
            <div class="max-w-6xl mx-auto py-6 ">
                <h2 class="md:text-2xl font-bold text-gray-800 mb-4">Pesanan Aktif</h2>
                <!-- Order Item -->
                <div class="md:grid max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg mb-3">
                    <div class="space-y-4">

                        <div class="items-center justify-between">
                            <div class="items-center space-x-4 space-y-4">
                                
                                    <div class="flex items-center justify-between">
                                        <div class="flex">
                                            <h2 class="pr-4 font-bold text-gray-700">{{ order?.id }}</h2>
                                            <p class="text-gray-500">{{ new Date(order?.createdAt).toLocaleString() }}</p>
                                        </div>
                                        
                                        <div>
                                            <p class="py-2 text-gray-500">Estimasi 15-30 menit</p>
                                        </div>
                                    </div>
                                    <!-- Customer Info -->
                                    <div class="mt-2 text-sm text-gray-600 space-y-1">
                                        <p><strong>Nama:</strong> {{ order?.form?.namaLengkap }}</p>
                                        <p><strong>No. HP:</strong> {{ order?.form?.nomorHp }}</p>
                                        <p><strong>Alamat:</strong> {{ order?.form?.alamatPengantaran }}</p>
                                        <p><strong>Catatan Dapur:</strong> {{ order?.form?.pesanUntukDapur || '-' }}</p>
                                    </div>
                           </div>
                        </div>
                    </div>
                </div>
                <div class="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg mb-3">
                    <div class="max-w-4xl mx-auto px-6 py-10">
                    <!-- Container for tracking -->
                    <!-- Tracking Progress -->
                    <div class="relative flex justify-between items-center">
                    <!-- line -->
                    <div class="absolute top-1/2 left-0 w-full h-1 bg-gray-300 -z-10 transform -translate-y-1/2">
                        <div
                        class="h-1 bg-[#3D5943] transition-all duration-500 ease-in-out"
                        :style="{ width: ((currentStep + 1) / steps.length) * 100 + '%' }"
                        ></div>
                    </div>

                    <div
                        v-for="(step, index) in steps"
                        :key="index"
                        class="flex flex-col items-center text-center"
                    >
                        <div
                        class="text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3"
                        :class="{
                            'bg-[#3D5943] border-white': index <= currentStep,
                            'bg-gray-300 border-white': index > currentStep
                        }"
                        >✓</div>
                        <span
                        class="mt-2 text-sm"
                        :class="index <= currentStep ? 'text-[#3D5943]' : 'text-gray-400'"
                        >{{ step.label }}</span>
                        <span class="text-xs text-gray-400">–</span>
                    </div>
                    </div>

                    </div>
                </div>

                <div class="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg mb-3">
                    <h2 class="text-xl font-semibold text-gray-800 mb-4">Ringkasan pesanan</h2>
                        <div class="space-y-2">
                            <div
                                v-for="(item, index) in order?.items"
                                :key="index"
                                class="flex justify-between"
                            >
                                <span>{{ item.name }} x{{ item.quantity }}</span>
                                <span>Rp {{ (item.price * item.quantity).toLocaleString('id-ID') }}</span>
                            </div>

                            <div class="flex justify-between">
                                <span>Ongkir</span>
                                <span>Rp {{ order?.ongkir.toLocaleString('id-ID') }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span>Biaya admin</span>
                                <span>Rp {{ order?.biayaAdmin.toLocaleString('id-ID') }}</span>
                            </div>
                            <div class="flex justify-between font-bold">
                                <span>Total</span>
                                <span>Rp {{ order?.total.toLocaleString('id-ID') }}</span>
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