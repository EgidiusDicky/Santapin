import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axiosClient from '@/axios'
import { useAuthStore } from '@/stores/authStore'

export const useCartStore = defineStore('cart', () => {
    const items = ref([])
    const loading = ref(true) // <-- UBAH: Inisialisasi loading sebagai true
    const error = ref(null)

    const cartTotal = computed(() => {
        return items.value.reduce((total, item) => total + item.price * item.quantity, 0)
    })

    async function fetchCart() {
        const authStore = useAuthStore()
        if (!authStore.isLoggedIn) {
            items.value = []
            loading.value = false; // Set false jika tidak login
            console.log('User not logged in, cart cleared locally.');
            return
        }

        // HANYA SET loading ke true jika belum true (misal, untuk inisialisasi awal)
        // Atau jika ini dipanggil dari operasi yang memang butuh indikator loading
        if (!loading.value) { // Hindari flicker jika sudah true dari awal
            loading.value = true;
        }
        error.value = null;
        try {
            const response = await axiosClient.get('/cart')
            items.value = response.data.map(cartItem => ({
                id: cartItem.id, // cart_item_id
                product_id: cartItem.product_id,
                name: cartItem.product.name,
                price: cartItem.product.price,
                image: cartItem.product.image,
                quantity: cartItem.quantity,
            }))
            console.log('🛒 Cart fetched from backend:', items.value)
        } catch (err) {
            console.error('Error fetching cart:', err)
            items.value = []
            error.value = err.response?.data?.message || 'Failed to fetch cart items.'
            throw err;
        } finally {
            loading.value = false; // Selalu set loading ke false setelah selesai
        }
    }

    async function addToCart(productToAdd) {
        const authStore = useAuthStore()
        if (!authStore.isLoggedIn) {
            error.value = 'User must be logged in to add items to cart.';
            throw new Error('User must be logged in to add items to cart.');
        }

        // Tidak perlu set loading.value = true di sini karena ini update kecil
        error.value = null;
        try {
            const existingCartItemIndex = items.value.findIndex(item => item.product_id === productToAdd.id);

            let response;
            if (existingCartItemIndex !== -1) {
                // Item sudah ada, update kuantitas di backend dan frontend
                const currentCartItem = items.value[existingCartItemIndex];
                const newQuantity = currentCartItem.quantity + (productToAdd.quantity || 1);
                response = await axiosClient.patch(`/cart/${currentCartItem.id}`, {
                    quantity: newQuantity,
                });
                items.value[existingCartItemIndex].quantity = newQuantity; // Update manual frontend
                console.log('Product quantity updated in cart:', response.data.cartItem);
            } else {
                // Item baru, tambahkan ke backend dan kemudian fetch ulang untuk mendapatkan ID yang benar
                // Set loading di sini karena ini operasi yang mengubah struktur keranjang
                loading.value = true; // <-- Set loading true untuk penambahan item BARU
                try {
                    response = await axiosClient.post('/cart', {
                        product_id: productToAdd.id,
                        quantity: productToAdd.quantity || 1,
                    });
                    // Setelah item baru ditambahkan, fetch ulang untuk memastikan state sinkron,
                    // terutama untuk mendapatkan cart_item_id yang baru.
                    await fetchCart(); // fetchCart sudah handle loading.value = false
                    console.log('New product added to cart:', response.data.cartItem);
                } finally {
                    loading.value = false; // Pastikan loading mati setelah fetchCart() selesai
                }
            }
            return response.data.cartItem;
        } catch (err) {
            console.error('Error adding to cart:', err.response ? err.response.data : err.message);
            error.value = err.response?.data?.message || 'Failed to add item to cart.';
            throw err;
        }
    }

    async function increment(cartItemId) {
        const authStore = useAuthStore()
        if (!authStore.isLoggedIn) return

        error.value = null;
        try {
            const itemIndex = items.value.findIndex(i => i.id === cartItemId)
            if (itemIndex !== -1) {
                const newQuantity = items.value[itemIndex].quantity + 1;
                await axiosClient.patch(`/cart/${cartItemId}`, {
                    quantity: newQuantity,
                })
                items.value[itemIndex].quantity = newQuantity; // Update manual frontend
            }
        } catch (err) {
            console.error('Error incrementing item:', err)
            error.value = err.response?.data?.message || 'Failed to increment item.';
            throw err;
        }
    }

    async function decrement(cartItemId) {
        const authStore = useAuthStore()
        if (!authStore.isLoggedIn) return

        error.value = null;
        try {
            const itemIndex = items.value.findIndex(i => i.id === cartItemId)
            if (itemIndex !== -1) {
                const newQuantity = items.value[itemIndex].quantity - 1;
                if (newQuantity > 0) {
                    await axiosClient.patch(`/cart/${cartItemId}`, {
                        quantity: newQuantity,
                    })
                    items.value[itemIndex].quantity = newQuantity; // Update manual frontend
                } else {
                    // Jika kuantitas jadi 0 atau kurang, hapus item sepenuhnya
                    await removeFromCart(cartItemId);
                }
            }
        } catch (err) {
            console.error('Error decrementing item:', err)
            error.value = err.response?.data?.message || 'Failed to decrement item.';
            throw err;
        }
    }

    async function removeFromCart(cartItemId) {
        const authStore = useAuthStore()
        if (!authStore.isLoggedIn) return

        loading.value = true; // <-- Tetap set loading true untuk penghapusan
        error.value = null;
        try {
            await axiosClient.delete(`/cart/${cartItemId}`)
            // Update frontend secara manual setelah penghapusan berhasil
            items.value = items.value.filter(item => item.id !== cartItemId);
            console.log('Item removed from cart:', cartItemId)
        } catch (err) {
            console.error('Error removing from cart:', err)
            error.value = err.response?.data?.message || 'Failed to remove item from cart.';
            throw err;
        } finally {
            loading.value = false; // <-- Selalu set loading false setelah selesai
        }
    }

    async function clearCart() {
        const authStore = useAuthStore()
        if (!authStore.isLoggedIn) {
             items.value = []
             return
        }
        loading.value = true; // <-- Tetap set loading true untuk clear cart
        error.value = null;
        try {
            await axiosClient.post('/cart/clear')
            items.value = []
            console.log('Cart cleared successfully (frontend and backend).')
        } catch (err) {
            console.error('Failed to clear cart on backend:', err)
            error.value = err.response?.data?.message || 'Failed to clear cart.';
            throw err;
        } finally {
            loading.value = false; // <-- Selalu set loading false setelah selesai
        }
    }

    return {
        items,
        cartTotal,
        loading,
        error,
        fetchCart,
        addToCart,
        increment,
        decrement,
        removeFromCart,
        clearCart
    }
})