<template>
  <section class="home-view">
    <h1>Vitajte v online obchode!</h1>
    <p>Prezrite si naše najnovšie produkty:</p>

    <div v-if="loading">Načítavam produkty...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="product-grid">

        <div v-for="product in sortedProducts" :key="product.id" :class="['product-card', { 'unavailable': product.productQuantity === 0 }]">
          <RouterLink :to="`/products/${product.id}`">
            <img :src="getProductImageUrl(product.productImage)" alt="Produktový obrázok" class="product-image" />
          </RouterLink>
          <RouterLink :to="`/products/${product.id}`">
          <p>{{ product.productName }}</p>
          </RouterLink>
          <p>{{ product.productPrice.toFixed(2) }} €</p>
          <p v-if="product.productQuantity === 0" class="out-of-stock">Nedostupné</p>
          <p v-else-if="product.productQuantity > 0">
            <button v-if="!cartStatus[product.id]" @click="addToCart(product)">Pridať do košíka</button>
              <p v-else class="text-green-500">Pridané do košíka!</p>
          </p>
        </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Product } from '@/models/Product';
import { ProductService } from '@/services/ProductService';
import { OrderItem } from '@/models/OrderItem';
import { OrderItemService } from '@/services/OrderItemService';
import { cartStore } from '@/stores/cartStore';

const products = ref<Product[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const cartStatus = ref<{ [key: number]: boolean }>({});

const orderItemService = new OrderItemService();

// Funkcia na generovanie URL pre obrázok
const getProductImageUrl = (imagePath: string) => {
  return `http://localhost:8080/${imagePath}`;
};

const sortedProducts = computed(() => {
  return [...products.value].sort((a, b) => a.productName.localeCompare(b.productName));
});

// Pridanie produktu do košíka
const addToCart = async (product: Product) => {
  cartStatus.value[product.id] = true;
  setTimeout(() => {
    cartStatus.value[product.id] = false;
  }, 2000);

  const orderItem = {
    productId: product.id,
    quantity: 1,
  };

  try {
    await orderItemService.addOrderItem(orderItem);
    cartStore.addItem(product.id, 1);
    await loadCartItems(); // Znova načítať obsah košíka
  } catch (err) {
    console.error('Nepodarilo sa pridať produkt do košíka', err);
  }
};



onMounted(async () => {
  const productService = new ProductService();
  try {
    products.value = await productService.getProducts();
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

.product-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 4 produkty vedľa seba */
  gap: 1rem; /* medzera medzi produktmi */
  padding: 1rem;
}

ul {
  list-style: none;
  padding: 0;
}

.product-card {
  border: 1px solid #ccc;
  padding: 1rem;
  text-align: center;
}

.product-image {
  max-width: 100%; /* Obrázok sa prispôsobí šírke kontajnera */
  height: auto;
  margin-bottom: 1rem; /* Medzera medzi obrázkom a textom */
}

.unavailable {
  background-color: #f2f2f2;
  color: #888;
  opacity: 0.6;
}

.out-of-stock {
  color: red;
  font-weight: bold;
}

.text-green-500 {
  color: #10b981;
}
</style>
