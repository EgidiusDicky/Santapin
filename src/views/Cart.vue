<script setup>
import { RouterLink } from 'vue-router';


</script>

<template>
    <body class="body">
        <section class="px-5">
            <div class="max-w-6xl mx-auto pt-6 ">
                <h1 class="text-2xl font-bold text-gray-800 mb-4">Keranjang anda</h1>
            </div>
            <!-- Cart Container -->
            <div class="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg mb-6">
                <div class="space-y-4">
                    <!-- Cart Item -->
                    <div class="flex items-center justify-between">
                        <!-- Foto produk -->
                         <div class="flex items-center space-x-4">
                            <img
                                src="/src/asset/Nasi Goreng Spesial.jpeg"
                                alt="Nama Produk"
                                class="w-20 h-20 object-cover rounded-md"
                            />
                            <div>
                                <p class="font-bold text-gray-700">Nasi Goreng Spesial</p>
                                <p class="text-gray-500">1x - Rp25.000</p>
                            </div>
                        </div>
                        
                        <div class="md:grid lg:flex items-center ">
                            <div class="flex items-center space-x-2">
                                <!-- Kurangi jumlah item -->
                                <button class="w-7 h-7 text-lg rounded bg-gray-200 text-gray-700 duration-500 hover:bg-gray-300">−</button>
                                <!-- Quantity Display -->
                                <span class="w-6 text-center text-sm">1</span>
                                <!-- Tambah jumalah item -->
                                <button class="w-7 h-7 text-lg rounded bg-gray-200 text-gray-700 duration-500 hover:bg-gray-300">+</button>
                                <!-- Hapus item -->
                             </div>
                            <button class="justify-center">
                                <img src="../asset/Bin icon.svg" alt="bin icon" class="h-8 opacity-40 duration-500 hover:opacity-100 sm:px-9 lg:px-5">
                            </button>
                        </div>
                    </div>
                    
                    <!-- Batas -->
                    <div class="border-b-1">
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <!-- Foto produk -->
                         <div class="flex items-center space-x-4">
                            <img
                                src="/src/asset/Nasi Goreng Spesial.jpeg"
                                alt="Nama Produk"
                                class="w-20 h-20 object-cover rounded-md"
                            />
                            <div>
                                <p class="font-bold text-gray-700">Nasi Goreng Spesial</p>
                                <p class="text-gray-500">1x - Rp25.000</p>
                            </div>
                        </div>
                        
                        <div class="md:grid lg:flex items-center ">
                            <div class="flex items-center space-x-2">
                                <!-- Kurangi jumlah item -->
                                <button class="w-7 h-7 text-lg rounded bg-gray-200 text-gray-700 duration-500 hover:bg-gray-300">−</button>
                                <!-- Quantity Display -->
                                <span class="w-6 text-center text-sm">1</span>
                                <!-- Tambah jumalah item -->
                                <button class="w-7 h-7 text-lg rounded bg-gray-200 text-gray-700 duration-500 hover:bg-gray-300">+</button>
                                <!-- Hapus item -->
                             </div>
                            <button class="justify-center">
                                <img src="../asset/Bin icon.svg" alt="bin icon" class="h-8 opacity-40 duration-500 hover:opacity-100 sm:px-9 lg:px-5">
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>

        <section class="pb-6 px-5">
            <!-- Order Summary Container -->
            <div class="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Ringkasan pesanan</h2>

            <div class="space-y-2 text-gray-700">
                <div class="flex justify-between">
                <span>Subtotal</span>
                <span>Rp65.000</span>
                </div>
                <div class="flex justify-between">
                <span>Ongkir</span>
                <span>Rp10.000</span>
                </div>
                <div class="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span>Rp75.000</span>
                </div>
            </div>

            <!-- Checkout Button -->
            <router-link
          to="/checkout"
          class="block mt-6 text-center bg-[#814C3C] text-white font-semibold py-3 rounded-md hover:bg-[#3d5943] transition"
        >
          Checkout
        </router-link>
            </div>
        </section>
            
    </body>
</template>

<style scoped>
.body{
    background-color: whitesmoke;
}
</style>