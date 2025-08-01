<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useMenuStore } from '@/stores/menuStore'
import { useCartStore } from '@/stores/cartStore'
import { useNotificationStore } from '@/stores/notificationStore'
import { useReviewStore } from '@/stores/reviewStore'
import { ref, computed, onMounted } from 'vue'

const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()
const cart = useCartStore()
const notificationStore = useNotificationStore()
const reviewStore = useReviewStore()

const imageBaseUrl = import.meta.env.VITE_APP_IMAGE_URL;
const quantity = ref(1)
const menuId = computed(() => Number(route.params.id))
const menu = computed(() => menuStore.getItemById(menuId.value))

const totalPrice = computed(() => {
    if (menu.value && typeof menu.value.price === 'number') {
        return menu.value.price * quantity.value;
    }
    return 0;
});

// Panggil action untuk mengambil review saat komponen dimuat
onMounted(() => {
    if (menuId.value) {
        reviewStore.fetchReviewsForProduct(menuId.value);
    }
});

const goBack = () => {
    if (window.history.length > 1) {
        router.back()
    } else {
        router.push('/menu')
    }
}

const addToCart = async () => {
    if (menu.value) {
        const itemToAdd = {
            id: menu.value.id,
            name: menu.value.name,
            price: menu.value.price,
            image: menu.value.image,
            quantity: quantity.value,
        }
        try {
            await cart.addToCart(itemToAdd)
            notificationStore.triggerPopup(`${quantity.value} ${menu.value.name} berhasil ditambahkan ke keranjang!`, 'success');
        } catch (error) {
            if (error.message.includes('User must be logged in')) {
                notificationStore.triggerPopup('Anda harus login terlebih dahulu!', 'error');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                notificationStore.triggerPopup(`Gagal menambahkan produk: ${error.message || 'Terjadi kesalahan.'}`, 'error');
            }
        }
    }
}

const handleAddToCart = () => {
    addToCart()
}

const increaseQty = () => {
    quantity.value++
}

const decreaseQty = () => {
    if (quantity.value > 1) quantity.value--
}
</script>

<template>
    <div class="bg-white text-[#5B3A29]">
        <div v-if="menu">
            <!-- Breadcrumb -->
            <nav aria-label="Breadcrumb" class="text-gray-600 mb-4 select-none px-6 sm:px-9 pt-6">
                <div class="relative z-10 w-full mx-auto">
                    <button class="flex space-x-2" @click="goBack">
                        <img src="../asset/Back arrow icon.svg" alt="">
                        <h2>Back</h2>
                    </button>
                </div>
            </nav>

            <!-- Main Content -->
            <main class="max-w-7xl mx-auto px-6 sm:px-10 pb-16">
                <!-- Flexbox untuk tata letak gambar di kiri dan detail di kanan -->
                <section class="flex flex-col sm:flex-row gap-8 sm:gap-12">
                    <!-- Image -->
                    <div class="flex-shrink-0 w-full sm:w-[400px] aspect-video bg-gray-200 rounded-lg overflow-hidden">
                        <img
                            :src="`${imageBaseUrl}/${menu.image}`"
                            :alt="menu.name"
                            @error="$event.target.src = '/no-image.png'"
                            class="w-full h-full object-cover"
                        />
                    </div>

                    <!-- Container untuk Detail, Quantity, Add to Cart, DAN Review -->
                    <div class="flex-1">
                        <h1 class="text-2xl font-extrabold mb-3">{{ menu.name }}</h1>
                        <p class="text-sm mb-4 leading-relaxed max-w-xl">{{ menu.description }}</p>

                        <p class="font-bold text-[#7A4A39] mb-4 text-2xl">
                            Rp. {{ totalPrice.toLocaleString('id-ID') }}
                        </p>

                        <!-- Quantity Control -->
                        <div class="flex items-center space-x-3 mb-6">
                            <button @click="decreaseQty" class="border border-[#7A4A39] text-[#7A4A39] rounded-md w-8 h-8 flex items-center justify-center text-lg font-semibold hover:bg-[#7A4A39] hover:text-white transition">−</button>
                            <span class="text-base font-normal w-8 text-center">{{ quantity }}</span>
                            <button @click="increaseQty" class="border border-[#7A4A39] text-[#7A4A39] rounded-md w-8 h-8 flex items-center justify-center text-lg font-semibold hover:bg-[#7A4A39] hover:text-white transition">+</button>
                        </div>

                        <!-- Add to Cart Button -->
                        <button @click="handleAddToCart" class="w-full bg-[#7A4A39] text-white font-semibold rounded-md py-2 hover:bg-[#6a3e2f] transition">
                            Tambah ke keranjang
                        </button>
                        
                        <!-- Bagian Review Dinamis, sekarang di dalam container yang sama -->
                        <section class="mt-6">
                            <h2 class="font-semibold text-lg mb-3">Customer Reviews</h2>
                            <div v-if="reviewStore.loading" class="space-y-4 animate-pulse">
                                <div v-for="n in 3" :key="n" class="border-b pb-4 last:border-b-0 last:pb-0">
                                    <div class="flex items-center justify-between mb-2">
                                        <div>
                                            <div class="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                                            <div class="h-3 bg-gray-200 rounded w-32"></div>
                                        </div>
                                        <div class="h-4 bg-gray-200 rounded w-16"></div>
                                    </div>
                                    <div class="h-4 bg-gray-200 rounded w-full"></div>
                                </div>
                            </div>
                            <div v-else-if="reviewStore.reviews.length > 0" class="space-y-6">
                                <div v-for="review in reviewStore.reviews" :key="review.id" class="border-b pb-4 last:border-b-0 last:pb-0">
                                    <div class="flex items-center justify-between mb-2">
                                        <div>
                                            <p class="font-bold text-gray-800">{{ review.user.name }}</p>
                                            <p class="text-sm text-gray-500">{{ new Date(review.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
                                        </div>
                                        <div class="flex text-yellow-400 text-lg">
                                            <span v-for="star in 5" :key="star" :class="{'text-yellow-400': star <= review.rating, 'text-gray-300': star > review.rating}">
                                                &#9733;
                                            </span>
                                        </div>
                                    </div>
                                    <p class="text-gray-700 text-base">{{ review.comment }}</p>
                                </div>
                            </div>
                            <div v-else class="text-center text-gray-500 py-4">
                                Belum ada review untuk menu ini.
                            </div>
                        </section>
                    </div>
                </section>
            </main>
        </div>

        <!-- Tampilkan ini jika data menu tidak ditemukan -->
        <div v-else class="text-center py-20 text-gray-500">
            <p>Menu tidak ditemukan.</p>
        </div>
    </div>
</template>