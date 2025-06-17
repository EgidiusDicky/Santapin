<script setup>
const { item } = defineProps(['item'])
defineEmits(['increment', 'decrement', 'remove'])
console.log('🛒 CartItem.vue received item:', item)
</script>

<template>
    <div class="flex items-center justify-between">
        <!-- Foto produk -->
            <div class="flex items-center space-x-4">
            <img :src="`http://localhost:8000/storage/${item.image}`" loading="lazy" :alt="item.name" class="w-20 h-20 object-cover rounded-md" />
            <div>
                <p class="font-bold text-gray-700">{{ item.name }}</p>
                <p class="text-gray-500">
                    {{ item.quantity }}x - Rp{{ Number(item.price) * Number(item.quantity) }}
                </p>

            </div>
        </div>
        
        <div class="flex items-center ">
            <div class="flex items-center space-x-2">
                <!-- Kurangi jumlah item -->
                <button @click="$emit('decrement')" class="w-7 h-7 text-lg rounded bg-gray-200 text-gray-700 hover:bg-gray-300">−</button>
                <!-- Quantity Display -->
                <span class="w-6 text-center text-sm">{{ item.quantity }}</span>
                <!-- Tambah jumlah item -->
                <button @click="$emit('increment')" class="w-7 h-7 text-lg rounded bg-gray-200 text-gray-700 hover:bg-gray-300">+</button>
                <!-- Hapus item -->
                </div>
            <button @click="$emit('remove')">
                <img src="../asset/Bin icon.svg" alt="bin icon" class="h-8 opacity-40 hover:opacity-100 md:px-6 sm:px-2">
            </button>
        </div>
    </div>

    <!-- Batas -->
    <div class="border-b-1 border-b-gray-300">
    </div>

</template>

<style scoped>

</style>