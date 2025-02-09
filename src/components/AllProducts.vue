<template>
<h1>My Products</h1>
<ul v-if="!loading">
  <li v-for="product in products" :key="product.id">
    <RouterLink :to="`/products/${product.id}`">
          {{ product.productName }}
        </RouterLink>
    <div>{{ product.productPrice }} €</div>
    <div>{{ product.productDescription }}</div>
  </li>
</ul>
<div v-else>Loading...</div>
</template>


<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import {ProductService} from '../services/ProductService';
import {Product} from '../models/Product';

export default defineComponent({
  name: 'AllProducts',
  setup() {
    const products = ref<Product[]>([]);
    const loading = ref(true);

    const getProducts = async () => {
      const productService = new ProductService();
      try {
        products.value = await productService.getProducts();
        console.log('Products loaded:', products.value);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(() => {
      getProducts();
    });

    return {
      products,
      loading,
    };
  },
});
</script>
