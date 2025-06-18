<script setup>
import CartItem from '@/components/CartItem.vue'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore' 
import { onMounted, watch } from 'vue'; // <--- TAMBAHKAN watch dan onMounted

const cart = useCartStore()
const authStore = useAuthStore()
const shippingCost = 2000
const adminCost = 1000

// Tambahkan watch untuk memicu fetchCart saat status autentikasi berubah
watch(() => authStore.isAuthenticated, async (isLoggedIn) => {
    if (isLoggedIn) {
        console.log('Auth status changed to logged in in Cart.vue, fetching cart...');
        await cart.fetchCart(); // Panggil fetchCart dari cart store
    } else {
        console.log('Auth status changed to logged out in Cart.vue, clearing cart locally.');
        cart.items = []; // Bersihkan item di frontend jika logout
    }
}, { immediate: true }); // immediate: true agar watch jalan saat komponen pertama kali dimounted (jika sudah login)

</script>

<template>
  <div class="body">
    <section class="px-5">
      <div class="max-w-6xl mx-auto pt-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Keranjang anda</h1>
      </div>

      <div class="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg mb-6">
        <div class="space-y-4">
          <p v-if="cart.loading" class="text-center text-gray-500 py-10 text-lg">
            Memuat keranjang...
          </p>
          <p v-else-if="!authStore.isAuthenticated" class="text-center text-gray-500 py-10 text-lg"> Anda harus login untuk melihat dan mengelola keranjang belanja Anda.
          </p>
          <p v-else-if="cart.error" class="text-center text-red-500 py-10 text-lg">
            Gagal memuat keranjang: {{ cart.error }}
          </p>
          <template v-else-if="cart.items.length === 0">
            <p class="text-center text-gray-500 py-10 text-lg">
              Keranjang kosong. Silakan tambahkan menu ke keranjang.
            </p>
          </template>
          <template v-else>
            <CartItem
              v-for="item in cart.items"
              :key="item.id"
              :item="item"
              @increment="cart.increment(item.id)"
              @decrement="cart.decrement(item.id)"
              @remove="cart.removeFromCart(item.id)"
            />
          </template>
        </div>
      </div>
    </section>

    <section class="pb-6 px-5">
      <div class="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Ringkasan pesanan</h2>

        <div class="space-y-2 text-gray-700">
          <template v-if="authStore.isAuthenticated && cart.items.length > 0 && !cart.loading && !cart.error"> <div class="flex justify-between">
              <span>Subtotal</span>
              <span>Rp{{ (cart.cartTotal || 0).toLocaleString('id-ID') }}</span>
            </div>
            <div class="flex justify-between">
              <span>Ongkir</span>
              <span>Rp{{ shippingCost.toLocaleString('id-ID') }}</span>
            </div>
            <div class="flex justify-between">
              <span>Biaya admin</span>
              <span>Rp{{ adminCost.toLocaleString('id-ID') }}</span>
            </div>
          </template>
          <p v-else class="text-center text-gray-500 py-2">
            Ringkasan pesanan tidak tersedia.
          </p>

          <div class="flex justify-between font-bold border-t pt-2">
            <span>Total</span>
            <span>
              Rp{{
                (
                  (cart.cartTotal || 0) +
                  (authStore.isAuthenticated && cart.items.length > 0 ? shippingCost : 0) + (authStore.isAuthenticated && cart.items.length > 0 ? adminCost : 0)      ).toLocaleString('id-ID')
              }}
            </span>
          </div>

          <router-link
            to="/checkout"
            class="block mt-6 w-full"
            v-if="authStore.isAuthenticated && cart.items.length > 0 && !cart.loading && !cart.error" >
            <button
              class="w-full bg-[#814C3C] text-white font-semibold py-2 rounded duration-500 hover:bg-[#3D5943] transition"
            >
              Checkout
            </button>
          </router-link>

          <button
            v-else
            disabled
            class="mt-6 w-full bg-[#814C3C] text-white font-semibold py-2 rounded opacity-50 cursor-not-allowed"
          >
            Checkout
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.body {
  background-color: whitesmoke;
}
</style>