import { defineStore } from 'pinia'
import { ref, computed, watchEffect } from 'vue'
import { OrderItem } from '@/models/OrderItem'
import { OrderItemService } from '@/services/OrderItemService'

export const useCartStore = defineStore('cart', () => {
  const orderItems = ref<OrderItem[]>(JSON.parse(localStorage.getItem('cart') || '[]'))

  const cartItemCount = computed(() => {
    return orderItems.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  const setCartItems = (items: OrderItem[]) => {
    orderItems.value = items
  }

  const updateCart = () => {
    orderItems.value = [...orderItems.value] // Vynútime reaktivitu
  }

  const clearCart = () => {
    orderItems.value = []
  }

  // ✅ Sledujeme `orderItems` a aktualizujeme `localStorage`
  watchEffect(() => {
    localStorage.setItem('cart', JSON.stringify(orderItems.value))
  })
  const increaseQuantity = (id: number) => {
    const item = orderItems.value.find((item) => item.id === id)
    if (item) {
      item.quantity++
      updateCart()
    }
  }

  const loadCart = async () => {
    const orderItemService = new OrderItemService()
    const items = await orderItemService.getOrderItems()
    orderItems.value = items // ✅ Aktualizuje Pinia store
  }

  const decreaseQuantity = (id: number) => {
    const item = orderItems.value.find((item) => item.id === id)
    if (item && item.quantity > 1) {
      item.quantity--
      updateCart()
    }
  }

  const removeItem = (id: number) => {
    orderItems.value = orderItems.value.filter((item) => item.id !== id)
    updateCart()
  }

  return {
    orderItems,
    cartItemCount,
    setCartItems,
    updateCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    loadCart,
  }
})
