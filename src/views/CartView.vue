<template>
  <section class="cart-view">
    <h1>Váš Košík</h1>

    <div v-if="loading">Načítavam položky košíka...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <table v-if="orderItems.length > 0" class="cart-table">
        <thead>
          <tr>
            <th>Obrazok</th>
            <th>Produkt</th>
            <th>Cena za kus</th>
            <th>Množstvo</th>
            <th>Celková cena</th>
            <th>Akcie</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in orderItems" :key="item.id">
            <td>
              <RouterLink :to="`/products/${item.product?.id}`">
                <img
                  :src="getProductImageUrl(item.product?.productImage || '')"
                  alt="Produktový obrázok"
                  class="product-thumbnail"
                />
              </RouterLink>
            </td>
            <td>
              <RouterLink :to="`/products/${item.product?.id}`" class="product-link">{{
                item.product?.productName
              }}</RouterLink>
            </td>
            <td>{{ item.product?.productPrice.toFixed(2) }} €</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.itemPrice.toFixed(2) }} €</td>
            <td>
              <button @click="increaseQuantity(item)">+</button>
              <button @click="decreaseQuantity(item)">-</button>
              <button @click="removeItem(item.id)">Odstrániť</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else>Košík je prázdny.</div>

      <!-- Zobrazenie celkovej ceny -->
      <div v-if="orderItems.length > 0" class="total-price">
        <h3>Celková cena: {{ totalCartPrice.toFixed(2) }} €</h3>
      </div>

      <!-- Tlačidlo na zobrazenie údajov checkoutu -->
      <button @click="continueToCheckout" :disabled="orderItems.length === 0">Pokračovať</button>

      <!-- Sekcia pre údaje používateľa alebo prihlásenie -->
      <div v-if="showCheckoutDetails && orderItems.length > 0" class="checkout-details">
        <div v-if="!userStore.isLoggedIn">
          <p>
            Nie ste prihlásený. Pre pokračovanie sa prosím
            <router-link to="/login">prihláste</router-link> alebo
            <router-link to="/register">registrujte.</router-link>
          </p>
        </div>

        <div v-else>
          <h2>Vaše údaje</h2>
          <p><strong>Meno:</strong> {{ userStore.user?.username }}</p>
          <p><strong>Email:</strong> {{ userStore.user?.userEmail }}</p>
          <p><strong>Adresa:</strong> {{ userStore.user?.userAddress }}</p>

          <button @click="createOrder()">Vytvoriť objednávku</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Order } from '@/models/Order'
import { OrderStatus } from '@/models/Order'
import { OrderItem } from '@/models/OrderItem'
import { OrderItemService } from '@/services/OrderItemService'
import { ProductService } from '@/services/ProductService'
import { User } from '@/models/User'
import { cartStore } from '@/stores/cartStore'
import { OrderService } from '@/services/OrderService'
import { useUserStore } from '@/stores/userStore'
import { useCartStore } from '@/stores/cartStore'
import { storeToRefs } from 'pinia'

// Košík
const cartStore = useCartStore()
const loading = ref<boolean>(true)
const error = ref<string | null>(null)
const orderItemService = new OrderItemService()
const productService = new ProductService()
const orderService = new OrderService()

const { orderItems } = storeToRefs(cartStore)

//orderItems.value = [...cartStore.orderItems]; // Vynútime reaktivitu
// ✅ Správne prepojenie na `cartStore`

// Zobrazenie sekcie s údajmi
const showCheckoutDetails = ref<boolean>(false)
const userStore = useUserStore()

// Celková cena košíka (computed property)
const totalCartPrice = computed(() =>
  orderItems.value.reduce((sum, item) => sum + item.itemPrice, 0),
)
// Funkcia na generovanie URL pre obrázok
const getProductImageUrl = (imagePath: string) => {
  return `http://localhost:8080/${imagePath}`
}

// Logy na debugging
console.log('🛒 Obsah orderItems:', orderItems.value)
console.log('🏁 CartView sa načítava...')
console.log('🔍 Užívateľ prihlásený:', userStore.isLoggedIn)
console.log('👤 Užívateľské údaje:', userStore.user)

// Načítanie položiek košíka pri načítaní komponentu

onMounted(async () => {
  await cartStore.loadCart();
  console.log("📦 Načítavam položky košíka...");

  // ✅ Odstrániť localStorage po prihlásení
  if (userStore.isLoggedIn) {
    localStorage.removeItem("cart");
  }

  try {
    const fetchedItems = await orderItemService.getOrderItems();

// ✅ Ak užívateľ je prihlásený, používame len serverové dáta
if (userStore.isLoggedIn) {
      cartStore.setCartItems([...fetchedItems]);
    } else {
      // Ak je neprihlásený, použijeme localStorage
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        cartStore.setCartItems(JSON.parse(savedCart));
      }
    }

    console.log("✅ Položky košíka načítané:", cartStore.orderItems);
  } catch (err) {
    console.error("❌ Chyba pri načítaní košíka:", err);
  } finally {
    loading.value = false;
  }
});



// Zvýšenie množstva položky
const increaseQuantity = async (item: OrderItem) => {
  if (!item.product || item.quantity >= item.product.productQuantity) {
    alert('Nie je možné pridať viac kusov, než je dostupné.')
    return
  }

  item.quantity++
  item.itemPrice = item.quantity * (item.product.productPrice || 0)

  try {
    await orderItemService.updateOrderItem(item)
    await productService.updateProductQuantity(item.product.id, item.product.productQuantity - 1) // ✅ Aktualizujeme produkt v databáze
    item.product.productQuantity-- // ✅ Aktualizujeme lokálne
    cartStore.updateCart() // ✅ Synchronizujeme store
  } catch (err) {
    console.error('❌ Chyba pri aktualizácii množstva produktu:', err)
  }
}

const decreaseQuantity = async (item: OrderItem) => {
  if (item.quantity > 1) {
    item.quantity--
    item.itemPrice = item.quantity * (item.product?.productPrice || 0)

    try {
      await orderItemService.updateOrderItem(item)
      await productService.updateProductQuantity(item.product.id, item.product.productQuantity + 1) // ✅ Aktualizujeme produkt v databáze
      item.product.productQuantity++ // ✅ Aktualizujeme lokálne
      cartStore.updateCart()
    } catch (err) {
      console.error('❌ Chyba pri aktualizácii množstva produktu:', err)
    }
  } else {
    await removeItem(item.id)
  }
}

// Odstránenie položky z košíka
const removeItem = async (id?: number) => {
  if (id !== undefined) {
    try {
      await orderItemService.deleteOrderItem(id)
      orderItems.value = orderItems.value.filter((item) => item.id !== id)
      cartStore.updateCart() // Aktualizujeme store
    } catch (err) {
      console.error('❌ Chyba pri odstraňovaní položky', err)
    }
  }
}

const continueToCheckout = () => {
  if (orderItems.value.length > 0) {
    console.log('🛒 Pokračujem na checkout...')
    showCheckoutDetails.value = true
  }
}

const getNumberOfItems = async () => {
  const orderItems = await orderItemService.getOrderItems()
  let orderQuantity: number = 0
  for (const item of orderItems) {
    orderQuantity += item.quantity
  }
  return console.log(orderQuantity)
}

// Metóda na vytvorenie objednávky
const createOrder = async () => {
  console.log('🔄 [CartView] Overujem používateľa...')
  userStore.fetchUserData() // ✅ Uistíme sa, že údaje sú aktuálne

  if (!userStore.user || !userStore.user.id) {
    console.error('❌ [CartView] Používateľ nie je prihlásený!')
    alert('❌ Chyba: Musíte byť prihlásený na vytvorenie objednávky!')
    return
  }

  const newOrder = {
    userId: userStore.user.id,
    orderItems: orderItems.value.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
      itemPrice: item.itemPrice,
    })),
    orderStatus: 'CREATED',
    orderDate: new Date().toISOString().split('T')[0],
  }

  console.log('📦 [CartView] Odosielam objednávku:', newOrder)

  try {
    const response = await orderService.createOrder(newOrder)
    alert(`✅ Objednávka bola úspešne vytvorená! ID: ${response.id}`)

    orderItems.value = []
    cartStore.clearCart()
    localStorage.removeItem('cart')
  } catch (error) {
    console.error('❌ [CartView] Chyba pri vytváraní objednávky:', error)
    alert('❌ Nepodarilo sa vytvoriť objednávku.')
  }
}
</script>

<style scoped>
.cart-view {
  padding: 2rem;
  text-align: center;
  max-width: 900px;
  margin: 2rem auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem 2.5rem;
}

/* 📦 Tabuľka košíka */
.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.cart-table th {
  background-color: #f4f4f4;
  padding: 1rem;
  text-align: center;
}

.cart-table td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

.cart-table tr:hover {
  background-color: #f9f9f9;
}

/* 🖼 Produktové obrázky */
.product-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  transition: transform 0.2s ease-in-out;
}

.product-thumbnail:hover {
  transform: scale(1.1);
}

/* 🔗 Odkazy na produkty */
.product-link {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.product-link:hover {
  text-decoration: underline;
}

/* 🔘 Tlačidlá */
button {
  background-color: #00bde7;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  cursor: pointer;
  border-radius: 6px;
  font-size: 1rem;
  transition: background 0.3s ease-in-out;
  margin: 0.2rem;
}

button:hover {
  background-color: #007bb5;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* ➕➖ Tlačidlá pre množstvo */
button.quantity-btn {
  width: 35px;
  height: 35px;
  font-size: 1.2rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

/* 🏷 Celková cena */
.total-price {
  margin: 1rem 0;
  font-size: 1.3rem;
  font-weight: bold;
}

/* 🛒 Checkout sekcia */
.checkout-details {
  margin-top: 2rem;
  padding: 1.5rem;
  border: 1px solid #ddd;
  background-color: #f9f9f9;
  text-align: left;
  border-radius: 8px;
}

/* 📦 Ak je košík prázdny */
.empty-cart {
  font-size: 1.2rem;
  font-weight: bold;
  color: #777;
  margin-top: 1rem;
}
</style>
