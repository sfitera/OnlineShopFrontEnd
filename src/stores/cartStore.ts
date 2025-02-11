import { reactive, watch } from 'vue'

const cartState = reactive({
  items: [] as { productId: number; quantity: number }[],
})

const cartStore = {
  getTotalQuantity() {
    return cartState.items.reduce((acc, item) => acc + item.quantity, 0)
  },

  updateCart(newItems: { productId: number; quantity: number }[]) {
    cartState.items = newItems
    this.triggerUpdate()
  },

  addItem(productId: number, quantity: number) {
    const existingItem = cartState.items.find((item) => item.productId === productId)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartState.items.push({ productId, quantity })
    }
    this.triggerUpdate()
  },

  removeItem(productId: number) {
    cartState.items = cartState.items.filter((item) => item.productId !== productId)
    this.triggerUpdate()
  },

  clearCart() {
    cartState.items = []
    this.triggerUpdate()
  },

  subscribe(callback: () => void) {
    watch(() => cartState.items, callback, { deep: true })
  },

  getCartItems() {
    return cartState.items
  },

  triggerUpdate() {
    // Ručne emitujeme zmenu
    cartState.items = [...cartState.items]
  },
}

export { cartStore }
