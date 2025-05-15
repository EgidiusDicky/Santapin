<script setup>
import { ref, computed } from 'vue'

const form = ref({
  namaLengkap: '',
  nomorHp: '',
  alamatPengantaran: '',
  pesanUntukDapur: '',
  tipePembayaran: '',
})

const paymentOptions = [
  { label: 'Bayar di Tempat (Cash on Delivery)', value: 'cod' },
  { label: 'Dompet Gila', value: 'dompet' },
  { label: 'Kartu Kredit/Debit', value: 'kartu' },
]

const orderItems = ref([
  { id: 1, name: 'Nasi Goreng', quantity: 2, price: 20000 },
  { id: 2, name: 'Es Teh Manis', quantity: 1, price: 5000 },
])

const subtotal = computed(() =>
  orderItems.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

const biayaAdmin = 3000
const total = computed(() => subtotal.value + biayaAdmin)
</script>

<template>
  <div class="bg-gray-100 min-h-screen py-10">
    <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- LEFT: Form & Payment -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Detail Pesanan -->
        <div>
          <h2 class="text-2xl font-semibold mb-4">Detail Pesanan</h2>
          <div class="grid gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nama Lengkap *</label>
              <input
                v-model="form.namaLengkap"
                type="text"
                required
                placeholder="Masukkan nama lengkap anda"
                class="mt-1 block w-full border border-gray-300 rounded-md p-2 placeholder-gray-400 text-black"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Nomor HP</label>
              <input
                v-model="form.nomorHp"
                type="text"
                placeholder="Masukkan nomor HP anda"
                class="mt-1 block w-full border border-gray-300 rounded-md p-2 placeholder-gray-400 text-black"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Alamat Pengantaran *</label>
              <textarea
                v-model="form.alamatPengantaran"
                required
                placeholder="Masukkan alamat lengkap pengantaran"
                class="mt-1 block w-full border border-gray-300 rounded-md p-2 h-24 placeholder-gray-400 text-black"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Tinggalkan Pesan untuk Dapur (Opsional)</label>
              <textarea
                v-model="form.pesanUntukDapur"
                placeholder="Contoh: Tidak pedas, sambal pisah"
                class="mt-1 block w-full border border-gray-300 rounded-md p-2 h-20 placeholder-gray-400 text-black"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Payment Options -->
<div>
  <h2 class="text-2xl font-semibold mb-4">Tipe Pembayaran</h2>
  <div class="flex flex-col gap-4">
    <label
      v-for="option in paymentOptions"
      :key="option.value"
      :class="[
        'flex items-center gap-3 border p-4 rounded-lg w-full cursor-pointer transition',
        form.tipePembayaran === option.value
          ? 'border-[#dfc2b9] bg-[#f7f0ee] ring-2 ring-[#814C3C]'
          : 'border-gray-300'
      ]"
    >
      <!-- Custom Radio Circle -->
      <div class="h-5 w-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
        <div
          v-if="form.tipePembayaran === option.value"
          class="w-2.5 h-2.5 bg-[#814C3C] rounded-full"
        ></div>
      </div>
      <input
        type="radio"
        v-model="form.tipePembayaran"
        :value="option.value"
        class="hidden"
      />
      <span class="text-sm text-gray-700">{{ option.label }}</span>
    </label>
  </div>
</div>

      </div>

      <!-- RIGHT: Ringkasan Pesanan -->
      <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm h-fit">
        <h3 class="text-xl font-semibold mb-4">Ringkasan Pesanan</h3>
        <ul class="mb-4 space-y-2">
          <li
            v-for="item in orderItems"
            :key="item.id"
            class="flex justify-between text-sm"
          >
            <span>{{ item.name }} x{{ item.quantity }}</span>
            <span>Rp{{ item.price * item.quantity }}</span>
          </li>
        </ul>
        <div class="text-sm space-y-1">
          <p class="flex justify-between">
            <span>Subtotal:</span>
            <span>Rp{{ subtotal }}</span>
          </p>
          <p class="flex justify-between">
            <span>Biaya Admin:</span>
            <span>Rp{{ biayaAdmin }}</span>
          </p>
          <p class="flex justify-between font-semibold text-gray-800">
            <span>Total:</span>
            <span>Rp{{ total }}</span>
          </p>
          <p class="text-xs text-gray-500 mt-2">
            Estimasi Waktu Pengantaran: 45 - 60 menit
          </p>
        </div>

        <router-link
          to="/konfirmasi"
          class="block mt-6 text-center bg-[#3d5943] text-white font-semibold py-3 rounded-md hover:bg-[#814C3C] transition"
        >
          Konfirmasi & Pesan
        </router-link>
      </div>
    </div>
  </div>
</template>


<style scoped>
.body{
    background-color: whitesmoke;
}
</style>