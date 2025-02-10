<template>
  <section v-if="product">
    <h1>{{ product.productName }}</h1>
    <img :src="getProductImageUrl(product.productImage)" alt="Produktový obrázok" class="product-image" />
    <p><strong>Cena:</strong> {{ product.productPrice }} €</p>
    <p><strong>Popis:</strong> {{ product.productDescription }}</p>
    <p><strong>Autor:</strong> {{ product.productAuthor }}</p>
    <p><strong>Kategória:</strong> {{ product.productCategory }}</p>
    <p><strong>Pocet kusov:</strong> {{ product.productQuantity }}</p>
    <p v-if="product.productAvailability">Produkt je dostupný.</p>
    <p v-else>Produkt nie je dostupný.</p>
    <button v-if="product.productQuantity > 0" @click="addToCart(product)">Pridať do košíka</button>



  </section>
  <div v-else>Načítavam produkt...</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ProductService } from '@/services/ProductService';
import { Product } from '@/models/Product';
import { OrderItem } from '@/models/OrderItem';
import { OrderItemService } from '@/services/OrderItemService';

export default defineComponent({
  name: 'ProductDetail',
  setup() {
    const product = ref<Product | null>(null);
    const route = useRoute();
    const productId = route.params.id as string;

    const orderItemService = new OrderItemService();

    onMounted(async () => {
      const productService = new ProductService();
      try {
        product.value = await productService.getProductById(parseInt(productId));
      } catch (error) {
        console.error('Chyba pri načítaní produktu:', error);
      }
    });

    const getProductImageUrl = (imagePath: string) => {
      return `http://localhost:8080/${imagePath}`;
    };

    // Pridanie produktu do košíka
  const addToCart = async (product: Product) => {
  const orderItem = new OrderItem(product, 1); // Pridávame s default množstvom 1
  try {
    await orderItemService.addOrderItem(orderItem);
    alert('Produkt bol pridaný do košíka.');
  } catch (err) {
    console.error('Nepodarilo sa pridať produkt do košíka', err);
  }
};

    return {
      product,
      getProductImageUrl,
      addToCart,
    };
  },
});
</script>

<style>
.product-image {
  max-width: 300px;  /* Maximálna šírka obrázka */
  height: auto;  /* Zachováva pomer strán */
}
</style>
