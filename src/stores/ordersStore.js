import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([])
  const lastOrder = ref(null)

  function addOrder(order) {
    orders.value.push(order)
    lastOrder.value = order
  }

  function getOrderById(id) {
    return orders.value.find(order => order.id === id)
  }

  return {
    orders,
    lastOrder,
    addOrder,
    getOrderById
  }
  }, {
  persist: true
})
