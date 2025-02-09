<template>
  <div v-if="loading">Načítavam údaje o produkte...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else>
    <h1>{{ product?.productName }}</h1>
    <p>{{ product?.productDescription }}</p>
    <p><strong>Cena:</strong> {{ product?.productPrice }} €</p>
    <p><strong>Autor:</strong> {{ product?.productAuthor }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { Product } from '@/models/Product';
import { ProductService } from '@/services/ProductService';

const product = ref<Product | null>(null);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);

const route = useRoute();

onMounted(async () => {
  const productService = new ProductService();
  const productId = route.params.id;

  if (!productId) {
    error.value = 'Neplatné ID produktu.';
    return;
  }

  try {
    product.value = await productService.getProductById(Number(productId));
  } catch {
    error.value = 'Nepodarilo sa načítať údaje o produkte.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
h1 {
  font-size: 2rem;
  color: #333;
}
</style>
