<template>
  <section v-if="product">
    <h1>{{ product.productName }}</h1>
    <img
      :src="getProductImageUrl(product.productImage)"
      alt="Produktový obrázok"
      class="product-image"
    />
    <p><strong>Cena:</strong> {{ product.productPrice.toFixed(2) }} €</p>
    <p><strong>Popis:</strong> {{ product.productDescription }}</p>
    <p><strong>Autor:</strong> {{ product.productAuthor }}</p>
    <p><strong>Kategória:</strong> {{ product.productCategory }}</p>
    <p><strong>Pocet kusov:</strong> {{ product.productQuantity }}</p>
    <p v-if="product.productQuantity > 0">Produkt je dostupný.</p>
    <p v-else class="out-of-stock">Produkt nie je dostupný.</p>

    <p v-if="product.productQuantity > 0">
      <button v-if="!cartStatus" @click="addToCart(product)" class="add-to-cart-btn">
        Pridať do košíka
      </button>
      <p v-else class="text-green-500">Pridané do košíka!</p>
    </p>
  </section>
  <div v-else>Načítavam produkt...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ProductService } from '@/services/ProductService';
import { Product } from '@/models/Product';
import { OrderItemService } from '@/services/OrderItemService';
import { cartStore } from '@/stores/cartStore';

const product = ref<Product | null>(null);
const cartStatus = ref<boolean>(false);
const route = useRoute();
const productId = route.params.id as string;

const orderItemService = new OrderItemService();
const productService = new ProductService();

onMounted(async () => {
  try {
    product.value = await productService.getProductById(parseInt(productId));
  } catch (error) {
    console.error('Chyba pri načítaní produktu:', error);
  }
});

const getProductImageUrl = (imagePath: string) => {
  return `http://localhost:8080/${imagePath}`;
};

// Pridanie produktu do košíka s kontrolou dostupnosti
const addToCart = async (product: Product) => {
  if (product.productQuantity <= 0) {
    console.error('Produkt nie je dostupný na pridanie do košíka.');
    return;
  }

  cartStatus.value = true;
  setTimeout(() => {
    cartStatus.value = false;
  }, 2000);

  const orderItem = {
    productId: product.id,
    quantity: 1,
  };

  try {
    await orderItemService.addOrderItem(orderItem);
    cartStore.addItem(product.id, 1);
    cartStore.triggerUpdate();

    // Aktualizácia množstva produktu v databáze
    product.productQuantity--;
    await productService.updateProductQuantity(product.id, product.productQuantity);
  } catch (err) {
    console.error('Nepodarilo sa pridať produkt do košíka', err);
  }
};
</script>

<style scoped>
.product-image {
  max-width: 300px;
  height: auto;
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

.text-green-500 {
  color: #10b981;
}

.out-of-stock {
  color: red;
  font-weight: bold;
}
</style>
