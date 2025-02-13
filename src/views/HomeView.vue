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
/* 🏠 Celkový layout */
.home-view {
  text-align: center;
  padding: 2rem;
  max-width: 1200px;
  margin: auto;
}

/* 🔲 Mriežka produktov (vždy 4 produkty na riadok) */
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4 produkty na riadok */
  gap: 1.5rem;
  padding: 1rem;
}

/* 🏷 Karty produktov */
.product-card {
  background: white;
  border-radius: 10px;
  padding: 1.2rem;
  text-align: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out, box-shadow 0.3s;
}

.product-card:hover {
  transform: scale(1.02);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
}

/* ❌ Nedostupné produkty */
.unavailable {
  background-color: #f8f8f8;
  color: #888;
  opacity: 0.6; /* Zašednuté */
}

.unavailable .product-image {
  filter: grayscale(60%); /* Mierne odfarbenie */
}

.unavailable .out-of-stock {
  color: red;
  font-weight: bold;
}

/* 🖼 Obrázky produktov */
.product-image {
  max-width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.2s ease-in-out;
}

.product-image:hover {
  transform: scale(1.05);
}

/* 🔗 Odkazy na detail produktu */
.product-card a {
  text-decoration: none;
  font-weight: bold;
  color: #333;
  display: block;
  margin-top: 0.5rem;
  font-size: 1.1rem;
}

.product-card a:hover {
  color: #007bff;
}

/* 💰 Cena a stav zásob */
.product-card p {
  font-size: 1rem;
  color: #555;
  margin: 0.5rem 0;
}

/* 🛒 Tlačidlá pridania do košíka */
.add-to-cart-btn {
  background-color: #00bde7;
  color: white;
  border: none;
  padding: 0.7rem 1rem;
  cursor: pointer;
  border-radius: 6px;
  font-size: 1rem;
  transition: background 0.3s;
  width: 100%;
  margin-top: 0.5rem;
}

.add-to-cart-btn:hover {
  background-color: #007bb5;
}

.add-to-cart-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* 📦 Info o dostupnosti */
.quantity-info {
  font-size: 0.9rem;
  color: #777;
  margin-top: 0.5rem;
}
</style>


