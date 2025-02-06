<template>
  <section class="home-view">
    <h1>Vitajte v online obchode!</h1>
    <p>Prezrite si naše najnovšie produkty:</p>

    <div v-if="loading">Načítavam produkty...</div>
    <div v-else-if="error">{{ error }}</div>
    <ul v-else>
      <li v-for="product in products" :key="product.id">
        {{ product.name }} - {{ product.price }} €
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiClient from '@/services/apiService';


interface Product {
  id: number;
  name: string;
  price: number;
}

const products = ref<Product[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const response = await apiClient.get('/products');
    products.value = response.data;
  } catch {
  error.value = 'Nepodarilo sa načítať produkty.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.home-view {
  text-align: center;
  padding: 2rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  padding: 0.5rem;
  font-size: 1.2rem;
}
</style>
