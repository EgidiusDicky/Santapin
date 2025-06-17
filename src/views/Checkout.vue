<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cartStore'
import { useOrdersStore } from '@/stores/ordersStore'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const ordersStore = useOrdersStore()
const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const deliveryFee = ref(2000)
const adminFee = ref(1000)

const form = ref({
  customer_name: '',
  customer_phone: '',
  delivery_address: '',
  notes: '',
  payment_type: ''
})

const paymentOptions = [
  { value: 'cod', label: 'Bayar di Tempat (COD)' },
  { value: 'qris_dummy', label: 'QRIS (Dummy)' },
  { value: 'bank_transfer', label: 'Transfer Bank' }
]

const orderItems = computed(() => cart.items)
const subtotal = computed(() => {
  return cart.cartTotal
})

const totalAmount = computed(() => {
  const currentSubtotal = subtotal.value
  const currentDeliveryFee = deliveryFee.value
  const currentAdminFee = adminFee.value

  return currentSubtotal +
         (cart.items.length > 0 ? currentDeliveryFee : 0) +
         (cart.items.length > 0 ? currentAdminFee : 0)
})

const formattedSubtotal = computed(() => subtotal.value.toLocaleString('id-ID'))
const formattedTotalAmount = computed(() => totalAmount.value.toLocaleString('id-ID'))

const validateAndSubmit = async () => {
  if (!form.value.customer_name || !form.value.delivery_address || !form.value.payment_type) {
    alert('Mohon lengkapi semua field yang wajib diisi (Nama, Alamat, Tipe Pembayaran).')
    return
  }

  if (cart.items.length === 0) {
    alert('Keranjang Anda kosong. Tidak dapat membuat pesanan.')
    return
  }

  const orderData = {
    customer_name:    form.value.customer_name,
    customer_phone:   form.value.customer_phone,
    delivery_address: form.value.delivery_address,
    notes:            form.value.notes,
    payment_type:     form.value.payment_type,
    subtotal:         subtotal.value,
    delivery_fee:     deliveryFee.value,
    admin_fee:        adminFee.value,
    total_amount:     totalAmount.value,
  }

  console.log('Attempting to place order with data:', orderData);
  
  try {
    await ordersStore.placeOrder(orderData)

    console.log('✅ Order placed successfully via store!');
    alert('Pesanan berhasil dibuat!');

    cart.clearCart();
    router.push('/receipt');

  } catch (err) {
    console.error('❌ Error placing order in Checkout.vue:', err);
    if (ordersStore.error === 'User not authenticated. Please log in.') {
        alert('Sesi Anda berakhir atau Anda belum login. Mohon login kembali.');
        router.push('/login');
    } else {
        alert('Gagal membuat pesanan: ' + ordersStore.error);
    }
  }
}
</script>

<template>
  <div class="checkout-page-wrapper"> <div class="flex items-center justify-between px-6 py-4 shadow-md bg-white sticky top-0 z-50">
        <div class="relative z-10 w-full max-w-6xl mx-auto">
            <button class="flex space-x-2" @click="goBack">
                <img src="../asset/Back arrow icon.svg" alt="">
                <h2>Back</h2>
            </button>
        </div>
    </div>

    <div class="bg-gray-100 min-h-screen py-5">
        <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-8">
                <div>
                    <h2 class="text-2xl font-semibold mb-4">Detail Pesanan</h2>
                    <div class="grid gap-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Nama Lengkap *</label>
                            <input
                                v-model="form.customer_name"
                                type="text"
                                required
                                placeholder="Masukkan nama lengkap anda"
                                class="mt-1 block w-full border border-gray-300 rounded-md p-2 placeholder-gray-400 text-black"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Nomor HP</label>
                            <input
                                v-model="form.customer_phone"
                                type="text"
                                placeholder="Masukkan nomor HP anda"
                                class="mt-1 block w-full border border-gray-300 rounded-md p-2 placeholder-gray-400 text-black"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Alamat Pengantaran *</label>
                            <textarea
                                v-model="form.delivery_address"
                                required
                                placeholder="Masukkan alamat lengkap pengantaran"
                                class="mt-1 block w-full border border-gray-300 rounded-md p-2 h-24 placeholder-gray-400 text-black"
                            ></textarea>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700">Tinggalkan Pesan untuk Dapur (Opsional)</label>
                            <textarea
                                v-model="form.notes"
                                placeholder="Contoh: Tidak pedas, sambal pisah"
                                class="mt-1 block w-full border border-gray-300 rounded-md p-2 h-20 placeholder-gray-400 text-black"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div>
                    <h2 class="text-2xl font-semibold mb-4">Tipe Pembayaran</h2>
                    <div class="flex flex-col gap-4">
                        <label
                            v-for="option in paymentOptions"
                            :key="option.value"
                            :class="[
                                'flex items-center gap-3 border p-4 rounded-lg w-full cursor-pointer transition',
                                form.payment_type === option.value
                                ? 'border-[#dfc2b9] bg-[#f7f0ee] ring-2 ring-[#814C3C]'
                                : 'border-gray-300'
                            ]"
                        >
                        <div class="h-5 w-5 rounded-full border-2 border-gray-400 flex items-center justify-center">
                            <div
                                v-if="form.payment_type === option.value"
                                class="w-2.5 h-2.5 bg-[#814C3C] rounded-full"
                            ></div>
                        </div>
                            <input
                                type="radio"
                                v-model="form.payment_type"
                                :value="option.value"
                                class="hidden"
                            />
                            <span class="text-sm text-gray-700">{{ option.label }}</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="bg-white border border-gray-200 rounded-lg p-6 shadow-sm h-fit">
                <h3 class="text-xl font-semibold mb-4">Ringkasan Pesanan</h3>
                <ul class="mb-1 space-y-1">
                    <li
                        v-for="item in orderItems"
                        :key="item.id"
                        class="flex justify-between text-sm"
                    >
                        <span>{{ item.name }} x{{ item.quantity }}</span>
                        <span>Rp{{ item.price * item.quantity }}</span>
                    </li>
                    <div class="border-b-1 border-b-gray-300">
                    </div>
                </ul>
                
                <div class="text-sm space-y-1">
                    <p class="flex justify-between">
                        <span>Subtotal:</span>
                        <span>Rp{{ formattedSubtotal }}</span>
                    </p>
                    <p class="flex justify-between">
                        <span>Ongkir:</span>
                        <span>Rp{{ deliveryFee }}</span>
                    </p>
                    <p class="flex justify-between">
                        <span>Biaya Admin:</span>
                        <span>Rp{{ adminFee }}</span>
                    </p>
                    <div class="border-b-1 border-b-gray-300">
                    </div>
                    <p class="flex justify-between font-semibold text-gray-800">
                        <span>Total:</span>
                        <span>Rp{{ formattedTotalAmount }}</span>
                    </p>
                    <p class="text-xs text-gray-500 mt-2">
                        Estimasi Waktu Pengantaran: 45 - 60 menit
                    </p>
                </div>

                <button
                    @click="validateAndSubmit"
                    :disabled="ordersStore.isLoading"
                    class="block mt-6 w-full text-center bg-[#3d5943] text-white font-semibold py-3 rounded-md hover:bg-[#814C3C] transition"
                    >
                    {{ ordersStore.isLoading ? 'Membuat Pesanan...' : 'Konfirmasi & Pesan' }}
                </button>
                <p v-if="ordersStore.error" class="text-red-500 text-sm mt-2">{{ ordersStore.error }}</p>
            </div>
        </div>
    </div>
  </div> </template>

<style scoped>
.body{
    background-color: whitesmoke;
}
</style>