<template>
  <section class="home-view">
    <h1>Vitajte v online obchode!</h1>
    <p>Prezrite si naše najnovšie produkty:</p>

    <div v-if="loading">Načítavam produkty...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else class="product-grid">
        <div v-for="product in filteredProducts" :key="product.id" :class="['product-card', { 'unavailable': product.productQuantity === 0 }]">
          <RouterLink :to="`/products/${product.id}`">
            <img :src="getProductImageUrl(product.productImage)" alt="Produktový obrázok" class="product-image" />
          </RouterLink>
          <RouterLink :to="`/products/${product.id}`">
          <p>{{ product.productName }}</p>
          </RouterLink>
          <p>{{ product.productPrice.toFixed(2) }} €</p>
          <p v-if="product.productQuantity === 0" class="out-of-stock">Nedostupné</p>
          <p v-else>
            <button
              v-if="!cartStatus[product.id]"
              :disabled="product.productQuantity === 0"
              @click="addToCart(product)"
              class="add-to-cart-btn">
              Pridať do košíka
            </button>
            <p v-else class="text-green-500">Pridané do košíka!</p>
          </p>
          <p class="quantity-info">Dostupné množstvo: {{ product.productQuantity }}</p>
        </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Product } from '@/models/Product';
import { ProductService } from '@/services/ProductService';
import { OrderItemService } from '@/services/OrderItemService'
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore();
const products = ref<Product[]>([]);
const loading = ref<boolean>(true);
const error = ref<string | null>(null);
const cartStatus = ref<Record<number, boolean>>({});
const route = useRoute();
const orderItemService = new OrderItemService();
const productService = new ProductService();


// ✅ Automatické načítanie produktov
const fetchProducts = async () => {
  try {
    products.value = await productService.getProducts();
  } catch {
    error.value = 'Nepodarilo sa načítať produkty.';
  } finally {
    loading.value = false;
  }
};

// ✅ Automaticky načítať košík a produkty pri návrate na HomeView
const refreshData = async () => {
  console.log("🔄 Obnovujem údaje v HomeView...");
  await cartStore.loadCart(); // 🔥 Znovu načíta košík
  await fetchProducts(); // 🔥 Znovu načíta produkty
};


onMounted(fetchProducts);
watch(route, refreshData)

const filteredProducts = computed(() => {
  const category = route.query.category as string
  const search = route.query.search as string
  let filtered = products.value

  if (category && category !== 'all') {
    filtered = filtered.filter(product => product.productCategory === category)
  } else {
    filtered = [...products.value].sort((a, b) => a.productName.localeCompare(b.productName))
  }
  if (search) {
    const searchLower = search.toLowerCase()
    filtered = filtered.filter(product =>
      product.productName.toLowerCase().includes(searchLower) ||
      (product.productDescription && product.productDescription.toLowerCase().includes(searchLower)) ||
      (product.productAuthor && product.productAuthor.toLowerCase().includes(searchLower))
    )
  }

  return filtered
})

const getProductImageUrl = (imagePath: string) => {
  return `http://localhost:8080/${imagePath}`
}

const addToCart = async (product: Product) => {
  if (product.productQuantity <= 0) {
    console.error('❌ Produkt nie je dostupný na pridanie do košíka.');
    return;
  }

  console.log("🛒 Pridávam do košíka:", product);
  cartStatus.value[product.id] = true;
  setTimeout(() => {
    cartStatus.value[product.id] = false;
  }, 2000);

  const orderItem = {
    productId: product.id,
    quantity: 1,
    itemPrice: product.productPrice
  };

  try {
    const addedItem = await orderItemService.addOrderItem(orderItem);
    console.log("✅ Položka pridaná do košíka:", addedItem);

    await cartStore.loadCart(); // ✅ Načíta aktuálny košík z API

    product.productQuantity--; // ✅ Odpíšeme zo skladu
  } catch (err) {
    console.error('❌ Nepodarilo sa pridať produkt do košíka', err);
  }
};






/*onMounted(async () => {
  try {
    products.value = await productService.getProducts()
  } catch {
    error.value = 'Nepodarilo sa načítať produkty.'
  } finally {
    loading.value = false
  }
})*/
</script>

<style scoped>
.home-view {
  text-align: center;
  padding: 2rem;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
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
  max-width: 100%;
  height: auto;
  margin-bottom: 1rem;
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

.add-to-cart-btn {
  background-color: #00bde7;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 8px;
}

.add-to-cart-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.quantity-info {
  font-size: 0.9rem;
  color: #666;
}
</style>
