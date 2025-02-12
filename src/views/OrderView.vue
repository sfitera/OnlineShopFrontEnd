<template>
  <section class="orders">
    <h1>Moje objednávky</h1>
    <div v-if="loading">Načítavam objednávky...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-for="order in orders" :key="order.id" class="order">
        <h2>Objednávka č. {{ order.id }}</h2>
        <p><strong>Dátum:</strong> {{ order.orderDate }}</p>
        <p><strong>Cena:</strong> {{ order.totalPrice }} €</p>
        <p><strong>Stav:</strong> {{ order.orderStatus }}</p>
        <h3>Produkty</h3>
        <div v-for="item in order.orderItems" :key="item.id" class="order-item">
          <img
            :src="getProductImageUrl(item.product?.imagePath)"
            alt="obrázok"
            class="order-item-image"
          />
          <p><strong>Produkt:</strong> {{ item.product?.productName }}</p>
          <p><strong>Cena za kus:</strong> {{ item.product?.productPrice.toFixed(2) }} €</p>
          <p><strong>Množstvo:</strong> {{ item.quantity }}</p>
          <p><strong>Celková cena:</strong> {{ item.itemPrice.toFixed(2) }} €</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Order } from '@/models/Order'
import { OrderService } from '@/services/OrderService'
import { ProductService } from '@/services/ProductService'

const orderService = new OrderService()
const productService = new ProductService()
const orders = ref<Order[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

const getProductImageUrl = (imagePath: string) => {
  return `http://localhost:8080/${imagePath}`
}

onMounted(async () => {
  try {
    orders.value = await orderService.getOrders()
  } catch {
    error.value = 'Nepodarilo sa načítať objednávky.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped></style>
