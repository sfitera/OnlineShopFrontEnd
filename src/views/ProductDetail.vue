<template>
  <section class="product-detail" v-if="product">
    <div class="product-card">
      <div class="image-container">
        <img
          :src="getProductImageUrl(product.productImage)"
          alt="Produktový obrázok"
          class="product-image"
        />
      </div>
      <div class="product-info">
        <h1 class="product-title">{{ product.productName }}</h1>
        <p class="product-author"><strong>Autor:</strong> {{ product.productAuthor }}</p>
        <p class="product-category"><strong>Kategória:</strong> {{ product.productCategory }}</p>
        <p class="product-description">{{ product.productDescription }}</p>
        <p class="product-price"><strong>Cena:</strong> {{ product.productPrice.toFixed(2) }} €</p>

        <p v-if="product.productQuantity > 0" class="available">Produkt je dostupný.</p>
        <p v-else class="out-of-stock">Produkt nie je dostupný.</p>

        <p v-if="product.productQuantity > 0"></p>
        <button v-if="!cartStatus" @click="addToCart(product)" class="add-to-cart-btn">
          Pridať do košíka
        </button>
        <p v-else class="text-green-500">Pridané do košíka!</p>
      </div>
    </div>
  </section>
  <div v-else class="loading">Načítavam produkt...</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ProductService } from '@/services/ProductService'
import { Product } from '@/models/Product'
import { OrderItemService } from '@/services/OrderItemService'
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()
const product = ref<Product | null>(null)
const cartStatus = ref<boolean>(false)
const route = useRoute()
const productId = route.params.id as string

const orderItemService = new OrderItemService()
const productService = new ProductService()

onMounted(async () => {
  try {
    product.value = await productService.getProductById(parseInt(productId))
  } catch (error) {
    console.error('Chyba pri načítaní produktu:', error)
  }
})

const getProductImageUrl = (imagePath: string) => {
  return `http://localhost:8080/${imagePath}`
}

// Pridanie produktu do košíka s kontrolou dostupnosti
const addToCart = async (product: Product) => {
  if (product.productQuantity <= 0) {
    console.error('❌ Produkt nie je dostupný na pridanie do košíka.')
    return
  }

  console.log('🛒 Pridávam do košíka:', product)

  cartStatus.value = true
  setTimeout(() => {
    cartStatus.value = false
  }, 2000)

  const orderItem = {
    productId: product.id,
    quantity: 1,
    itemPrice: product.productPrice,
  }

  try {
    const addedItem = await orderItemService.addOrderItem(orderItem)

    if (!addedItem || !addedItem.productId) {
      console.error('❌ Chyba: Položka sa nevrátila správne z backendu!', addedItem)
      return
    }

    // 🔥 Oprava: Ukladáme iba objekt orderItem, nie reťazce "Order item added successfully"
    cartStore.orderItems.push(addedItem)
    cartStore.updateCart()

    console.log('✅ Položka pridaná do košíka:', cartStore.orderItems)

    // Odpíšeme zo skladu
    product.productQuantity--
    await productService.updateProductQuantity(product.id, product.productQuantity)
  } catch (err) {
    console.error('❌ Nepodarilo sa pridať produkt do košíka', err)
  }
}
</script>

<style scoped>
/* Kontejner stránky */
.product-detail {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  background-color: #f9f9f9;
}

/* Štýl karty produktu */
.product-card {
  display: flex;
  gap: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  max-width: 900px;
  width: 100%;
}

/* Obrázok produktu */
.image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  max-width: 350px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  object-fit: cover;
}

/* Informácie o produkte */
.product-info {
  flex: 2;
  text-align: left;
}

.product-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.product-author,
.product-category,
.product-description,
.product-price {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.available {
  color: green;
  font-weight: bold;
}

.out-of-stock {
  color: red;
  font-weight: bold;
}

/* Tlačidlo "Pridať do košíka" */
.add-to-cart-btn {
  background-color: #00bde7;
  color: white;
  padding: 0.8rem 1.5rem;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1.2rem;
  transition: background 0.3s ease-in-out;
}

.add-to-cart-btn:hover {
  background-color: #007bb5;
}

.add-to-cart-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* Správa o pridaní do košíka */
.added-message {
  margin-top: 0.5rem;
  color: #10b981;
  font-size: 1.2rem;
}

/* Načítavanie produktu */
.loading {
  text-align: center;
  font-size: 1.5rem;
  padding: 3rem;
  color: #555;
}
</style>
