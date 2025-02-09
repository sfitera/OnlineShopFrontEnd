<template>
  <section v-if="product">
    <h1>{{ product.productName }}</h1>
    <img :src="getProductImageUrl(product.productImage)" alt="Produktový obrázok" class="product-image" />
    <p><strong>Cena:</strong> {{ product.productPrice }} €</p>
    <p><strong>Popis:</strong> {{ product.productDescription }}</p>
    <p><strong>Autor:</strong> {{ product.productAuthor }}</p>
    <p><strong>Kategória:</strong> {{ product.productCategory }}</p>
    <p><strong>Kategória:</strong> {{ product.productQuantity }}</p>
    <p v-if="product.productAvailability">Produkt je dostupný.</p>
    <p v-else>Produkt nie je dostupný.</p>



  </section>
  <div v-else>Načítavam produkt...</div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ProductService } from '@/services/ProductService';
import { Product } from '@/models/Product';

export default defineComponent({
  name: 'ProductDetail',
  setup() {
    const product = ref<Product | null>(null);
    const route = useRoute();
    const productId = route.params.id as string;

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

    return {
      product,
      getProductImageUrl,
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
