<template>
  <section class="cart-view">
    <h1>Váš Košík</h1>
    <div v-if="loading">Načítavam položky košíka...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <table v-if="orderItems.length > 0" class="cart-table">
        <thead>
          <tr>
            <th>Produkt</th>
            <th>Cena za kus</th>
            <th>Množstvo</th>
            <th>Celková cena</th>
            <th>Akcie</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in orderItems" :key="item.id">
            <td>{{ item.product?.productName }}</td>
            <td>{{ item.product?.productPrice }} €</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.itemPrice }} €</td>
            <td>
              <button @click="increaseQuantity(item)">+</button>
              <button @click="decreaseQuantity(item)">-</button>
              <button @click="removeItem(item.id)">Odstrániť</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else>Košík je prázdny.</div>
      <button @click="getNumberOfItems()">Vytvorit objednavku</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { OrderItem } from '@/models/OrderItem';
import { OrderItemService } from '@/services/OrderItemService';

const orderItems = ref<OrderItem[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

const orderItemService = new OrderItemService();

// Načítanie položiek košíka pri načítaní komponentu
onMounted(async () => {
  try {
    orderItems.value = await orderItemService.getOrderItems();
  } catch {
    error.value = 'Nepodarilo sa načítať položky košíka.';
  } finally {
    loading.value = false;
  }
});

// Zvýšenie množstva položky
const increaseQuantity = async (item: OrderItem) => {
  item.quantity++;
  item.itemPrice = item.quantity * (item.product?.productPrice || 0);
  await orderItemService.updateOrderItem(item);
  return getNumberOfItems();
};

// Zníženie množstva položky
const decreaseQuantity = async (item: OrderItem) => {
  if (item.quantity > 1) {
    item.quantity--;
    item.itemPrice = item.quantity * (item.product?.productPrice || 0);
    await orderItemService.updateOrderItem(item);
  } else {
    await removeItem(item.id);
  }
};

// Odstránenie položky z košíka
const removeItem = async (id?: number) => {
  if (id !== undefined) {
    try {
      await orderItemService.deleteOrderItem(id);
      orderItems.value = orderItems.value.filter(item => item.id !== id);
    } catch (err) {
      console.error('Chyba pri odstraňovaní položky', err);
    }
  }
};

const getNumberOfItems = async () => {
  const orderItems = await orderItemService.getOrderItems();
  let orderQuantity: number = 0;
  for (const item of orderItems) {
    orderQuantity += item.quantity;
  }
  return console.log(orderQuantity);
}
</script>

<style scoped>
.cart-view {
  padding: 2rem;
  text-align: center;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.cart-table th, .cart-table td {
  border: 1px solid #ccc;
  padding: 1rem;
  text-align: center;
}

button {
  margin: 0 0.5rem;
}
</style>
