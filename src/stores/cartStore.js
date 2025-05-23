import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])

function addToCart(item) {
  console.log('🚨 Incoming item:', item)
  const existing = items.value.find(i => i.id === item.id)
  if (existing) {
    existing.quantity += item.quantity
  } else {
    items.value.push({ ...item })
  }
  console.log('🛒 Cart state:', items.value)
  console.log('🛒 Cart before:', JSON.parse(JSON.stringify(items.value)))

  console.log('➕ Adding:', item)
  console.log('🧮 Quantity to add:', item.quantity)
}


  function increment(id) {
    const item = items.value.find(i => i.id === id)
    if (item) item.quantity += 1
  }

  function decrement(id) {
    const item = items.value.find(i => i.id === id)
    if (item && item.quantity > 1) {
      item.quantity -= 1
    } else {
      removeFromCart(id)
    }
  }

  function removeFromCart(id) {
    items.value = items.value.filter(i => i.id !== id)
  }

  function clearCart() {
    items.value = []
  }

const cartTotal = computed(() =>
  items.value.reduce((total, item) => {
    const price = Number(item.price) || 0
    const quantity = Number(item.quantity) || 0
    return total + price * quantity
  }, 0)
)


  return {
    items,
    addToCart,
    increment,
    decrement,
    removeFromCart,
    cartTotal,
    clearCart
  }
  
})
