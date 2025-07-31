// src/stores/cartStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axiosClient from '@/axios';
import { useAuthStore } from '@/stores/authStore'

export const useCartStore = defineStore('cart', () => {
    const items = ref([])
    const loading = ref(true)
    const error = ref(null)

    const cartTotal = computed(() => {
        return items.value.reduce((total, item) => total + item.price * item.quantity, 0)
    })

    async function fetchCart() {
        const authStore = useAuthStore()
        if (!authStore.isAuthenticated) { // <-- UBAH INI
            items.value = []
            loading.value = false;
            console.log('User not logged in, cart cleared locally.');
            return
        }

        if (!loading.value) {
            loading.value = true;
        }
        error.value = null;
        try {
            const response = await axiosClient.get('/cart')
            items.value = response.data.map(cartItem => ({
                id: cartItem.id,
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
            loading.value = false;
        }
    }

    async function addToCart(productToAdd) {
        const authStore = useAuthStore()
        if (!authStore.isAuthenticated) { // <-- UBAH INI
            error.value = 'User must be logged in to add items to cart.';
            throw new Error('User must be logged in to add items to cart.');
        }

        error.value = null;
        try {
            const existingCartItemIndex = items.value.findIndex(item => item.product_id === productToAdd.id);

            let response;
            if (existingCartItemIndex !== -1) {
                const currentCartItem = items.value[existingCartItemIndex];
                const newQuantity = currentCartItem.quantity + (productToAdd.quantity || 1);
                response = await axiosClient.patch(`/cart/${currentCartItem.id}`, {
                    quantity: newQuantity,
                });
                items.value[existingCartItemIndex].quantity = newQuantity;
                console.log('Product quantity updated in cart:', response.data.cartItem);
            } else {
                loading.value = true;
                try {
                    response = await axiosClient.post('/cart', {
                        product_id: productToAdd.id,
                        quantity: productToAdd.quantity || 1,
                    });
                    await fetchCart();
                    console.log('New product added to cart:', response.data.cartItem);
                } finally {
                    loading.value = false;
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
        if (!authStore.isAuthenticated) return // <-- UBAH INI

        error.value = null;
        try {
            const itemIndex = items.value.findIndex(i => i.id === cartItemId)
            if (itemIndex !== -1) {
                const newQuantity = items.value[itemIndex].quantity + 1;
                await axiosClient.patch(`/cart/${cartItemId}`, {
                    quantity: newQuantity,
                })
                items.value[itemIndex].quantity = newQuantity;
            }
        } catch (err) {
            console.error('Error incrementing item:', err)
            error.value = err.response?.data?.message || 'Failed to increment item.';
            throw err;
        }
    }

    async function decrement(cartItemId) {
        const authStore = useAuthStore()
        if (!authStore.isAuthenticated) return 

        error.value = null;
        try {
            const itemIndex = items.value.findIndex(i => i.id === cartItemId)
            if (itemIndex !== -1) {
                const newQuantity = items.value[itemIndex].quantity - 1;
                if (newQuantity > 0) {
                    await axiosClient.patch(`/cart/${cartItemId}`, {
                        quantity: newQuantity,
                    })
                    items.value[itemIndex].quantity = newQuantity;
                } else {
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
        if (!authStore.isAuthenticated) return // <-- UBAH INI

        loading.value = true;
        error.value = null;
        try {
            await axiosClient.delete(`/cart/${cartItemId}`)
            items.value = items.value.filter(item => item.id !== cartItemId);
            console.log('Item removed from cart:', cartItemId)
        } catch (err) {
            console.error('Error removing from cart:', err)
            error.value = err.response?.data?.message || 'Failed to remove item from cart.';
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function clearCart() {
        const authStore = useAuthStore()
        if (!authStore.isAuthenticated) { // <-- UBAH INI
            items.value = []
            return
        }
        loading.value = true;
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
            loading.value = false;
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