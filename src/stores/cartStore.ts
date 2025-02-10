import { reactive, watch } from 'vue';

const cartState = reactive({
  items: [] as { productId: number; quantity: number }[],
});

const cartStore = {
  getTotalQuantity() {
    return cartState.items.reduce((acc, item) => acc + item.quantity, 0);
  },

  updateCart(newItems: { productId: number; quantity: number }[]) {
    cartState.items = newItems;
  },

  addItem(productId: number, quantity: number) {
    const existingItem = cartState.items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartState.items.push({ productId, quantity });
    }
  },

  removeItem(productId: number) {
    cartState.items = cartState.items.filter(item => item.productId !== productId);
  },

  subscribe(callback: () => void) {
    watch(() => cartState.items, callback, { deep: true });
  },
};

export { cartStore };
