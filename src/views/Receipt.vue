<script setup>
import { useOrdersStore } from '@/stores/ordersStore'
import { computed } from 'vue'
import { useRouter } from 'vue-router' // Tambahkan import useRouter

const ordersStore = useOrdersStore()
const router = useRouter() // Inisialisasi router

// Mengakses nilai lastOrder. Gunakan v-if di template untuk memastikan order ada
const order = computed(() => ordersStore.lastOrder)

// Computed properties untuk memformat angka dengan aman
const formattedSubtotal = computed(() => {
  return order.value && typeof order.value.subtotal === 'number'
    ? order.value.subtotal.toLocaleString('id-ID')
    : '0'
})

const formattedDeliveryFee = computed(() => {
  return order.value && typeof order.value.delivery_fee === 'number'
    ? order.value.delivery_fee.toLocaleString('id-ID')
    : '0'
})

const formattedAdminFee = computed(() => {
  return order.value && typeof order.value.admin_fee === 'number'
    ? order.value.admin_fee.toLocaleString('id-ID')
    : '0'
})

const formattedTotalAmount = computed(() => {
  return order.value && typeof order.value.total_amount === 'number'
    ? order.value.total_amount.toLocaleString('id-ID')
    : '0'
})

// Fungsi untuk mendapatkan label tipe pembayaran yang lebih ramah pengguna
const getPaymentLabel = (type) => {
  switch (type) {
    case 'cod': return 'Bayar di Tempat (COD)';
    case 'qris_dummy': return 'QRIS (Dummy)';
    case 'bank_transfer': return 'Transfer Bank';
    default: return type;
  }
}

// Redirect jika tidak ada pesanan terakhir (misalnya diakses langsung)
// Ini adalah safety check agar Receipt.vue tidak crash jika lastOrder null
if (!order.value) {
    console.warn('No last order found in store. Redirecting to home/menu.');
    router.replace('/menu'); // Gunakan router.replace untuk menghindari entri duplikat di history
}


function goBackToMenu() {
  ordersStore.clearLastOrder() // Opsional: Kosongkan lastOrder setelah kembali ke menu
  router.push('/menu') // Gunakan router.push
}

function goOrder() {
  ordersStore.clearLastOrder() // Opsional: Kosongkan lastOrder setelah navigasi
  router.push('/orders') // Gunakan router.push
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex justify-center items-center px-4 py-8">
    <div v-if="order && order.id" class="w-full max-w-md space-y-4"> <div class="text-center px-6 pt-6">
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
            {{ order.estimated_delivery_time || '15 - 30 menit' }}
          </div>
        </div>

        <hr class="my-2" />

        <p class="font-semibold mb-2">Ringkasan pesanan</p>

        <div
          v-for="item in order.order_items"
          :key="item.id"
          class="flex justify-between text-sm mb-2"
        >
          <div>
            {{ item.product_name }}<br /> <span class="text-gray-500">jumlah: {{ item.quantity }}</span>
          </div>
          <div>Rp {{ (item.price * item.quantity).toLocaleString('id-ID') }}</div>
        </div>

        <hr class="my-2" />

        <div class="flex justify-between font-bold">
          <div>Subtotal</div>
          <div>Rp {{ formattedSubtotal }}</div>
        </div>
        <div class="flex justify-between text-sm">
          <div>Ongkir</div>
          <div>Rp {{ formattedDeliveryFee }}</div>
        </div>
        <div class="flex justify-between text-sm">
          <div>Biaya Admin</div>
          <div>Rp {{ formattedAdminFee }}</div>
        </div>
        <hr class="my-2" />
        <div class="flex justify-between font-bold">
          <div>Total</div>
          <div>Rp {{ formattedTotalAmount }}</div>
        </div>

        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <div>Tipe Pembayaran</div>
          <div>{{ getPaymentLabel(order.payment_type) }}</div>
        </div>
      </div>

      <div class="space-y-2">
        <button
          class="bg-[#3D5943] text-white w-full py-2 rounded hover:bg-[#2f4434]"
          @click="goOrder"
        >Lacak pesanan</button>
        <button
          class="w-full py-2 rounded border border-[#814C3C] text-[#814C3C] hover:bg-[#f5e9e5]"
          @click="goBackToMenu"
        >Kembali ke Menu</button>
      </div>
    </div>
    <div v-else class="text-center text-gray-700">
        <p>Tidak ada detail pesanan yang ditemukan. Mungkin halaman diakses secara langsung atau sesi berakhir.</p>
        <button
            class="w-full mt-4 py-2 rounded border border-[#814C3C] text-[#814C3C] hover:bg-[#f5e9e5]"
            @click="goBackToMenu"
        >Kembali ke Menu</button>
    </div>
  </div>
</template>