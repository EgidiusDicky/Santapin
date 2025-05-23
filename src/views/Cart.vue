<script setup>
import CartItem from '@/components/CartItem.vue'
import { useCartStore } from '@/stores/cartStore'

const cart = useCartStore()
const shippingCost = 2000
const adminCost = 1000
</script>

<template>
  <div class="body">
    <section class="px-5">
      <div class="max-w-6xl mx-auto pt-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-4">Keranjang anda</h1>
      </div>

      <!-- Cart Container -->
      <div class="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg mb-6">
        <div class="space-y-4">
          <template v-if="cart.items.length > 0">
            <CartItem
              v-for="item in cart.items"
              :key="item.id"
              :item="item"
              @increment="cart.increment(item.id)"
              @decrement="cart.decrement(item.id)"
              @remove="cart.removeFromCart(item.id)"
            />
          </template>
          <p v-else class="text-center text-gray-500 py-10 text-lg">
            Keranjang kosong. Silakan tambahkan menu ke keranjang.
          </p>
        </div>
      </div>
    </section>

    <!-- Order Summary -->
    <section class="pb-6 px-5">
      <div class="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Ringkasan pesanan</h2>

        <div class="space-y-2 text-gray-700">
          <template v-if="cart.items.length > 0">
            <div class="flex justify-between">
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

          <div class="flex justify-between font-bold border-t pt-2">
            <span>Total</span>
            <span>
              Rp{{
                (
                  (cart.cartTotal || 0) +
                  (cart.items.length > 0 ? shippingCost : 0) +
                  (cart.items.length > 0 ? adminCost : 0)
                ).toLocaleString('id-ID')
              }}
            </span>
          </div>

          <!-- Checkout Button -->
          <router-link
            to="/checkout"
            class="block mt-6 w-full"
            v-if="cart.items.length > 0"
          >
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
