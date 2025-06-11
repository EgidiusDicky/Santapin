<script setup>
import { useOrdersStore } from '@/stores/ordersStore'
import { computed } from 'vue'

const ordersStore = useOrdersStore()
const order = computed(() => ordersStore.lastOrder)

function goBackToMenu() {
  window.location.href = '/menu'
}
function goToOrder() {
  window.location.href = '/orders'
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex justify-center items-center px-4 py-8">
    <div class="w-full max-w-md space-y-4">
      <div class="text-center px-6 pt-6">
        <div class="bg-[#3D5943] text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
          ✓
        </div>
        <h5 class="text-xl font-bold text-gray-800">Terima Kasih</h5>
        <p class="text-sm text-gray-500">Pesanan anda akan kami proses</p>
      </div>

      <div class="bg-white px-6 py-4 rounded-lg shadow-lg ">
        <div class="flex justify-between text-sm mb-3">
          <div>
            <strong>Order ID</strong><br />
            {{ order.id }}
          </div>
          <div class="text-right">
            <strong>Estimated Time</strong><br />
            {{ order.estimatedTime }}
          </div>
        </div>

        <hr class="my-2" />

        <p class="font-semibold mb-2">Ringkasan pesanan</p>

        <div
          v-for="item in order.items"
          :key="item.id"
          class="flex justify-between text-sm mb-2"
        >
          <div>
            {{ item.name }}<br />
            <span class="text-gray-500">Qty: {{ item.quantity }}</span>
          </div>
          <div>Rp {{ (item.price * item.quantity).toLocaleString('id-ID') }}</div>
        </div>

        <hr class="my-2" />

        <div class="flex justify-between font-bold">
          <div>Total</div>
          <div>Rp {{ order.total.toLocaleString('id-ID') }}</div>
        </div>

        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <div>Tipe Pembayaran</div>
          <div>{{ order.form.tipePembayaran }}</div>
        </div>
      </div>

      <div class="space-y-2">
        <button 
          class="bg-[#3D5943] text-white w-full py-2 rounded hover:bg-[#2f4434]"
        @click="goToOrder"
          >Lacak pesanan</button>
        <button
          class="w-full py-2 rounded border border-[#814C3C] text-[#814C3C] hover:bg-[#f5e9e5]"
          @click="goBackToMenu"
        >Kembali ke Menu</button>
      </div>
    </div>
  </div>
</template>