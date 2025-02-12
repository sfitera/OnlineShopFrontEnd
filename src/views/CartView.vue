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
              <img
                :src="getProductImageUrl(item.product?.productImage || '')"
                alt="Produktový obrázok"
                class="product-thumbnail"
              />
            </td>
            <td>{{ item.product?.productName }}</td>
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
        <div v-if="!isLoggedIn">
          <p>
            Nie ste prihlásený. Pre pokračovanie sa prosím
            <router-link to="/login">prihláste</router-link> alebo
            <router-link to="/register">registrujte.</router-link>
          </p>
        </div>

        <div v-else>
          <h2>Vaše údaje</h2>
          <p><strong>Meno:</strong> {{ user?.userName }}</p>
          <p><strong>Email:</strong> {{ user?.userEmail }}</p>
          <p><strong>Adresa:</strong> {{ user?.userAddress }}</p>

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

// Košík
const orderItems = ref<OrderItem[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)
const orderItemService = new OrderItemService()
const productService = new ProductService();

// Zobrazenie sekcie s údajmi
const showCheckoutDetails = ref<boolean>(false)
// Mock používateľa (pre testovanie)
const user = ref<User | null>(null)
const isLoggedIn = ref<boolean>(false)

// Celková cena košíka (computed property)
const totalCartPrice = computed(() =>
  orderItems.value.reduce((sum, item) => sum + item.itemPrice, 0),
)
// Funkcia na generovanie URL pre obrázok
const getProductImageUrl = (imagePath: string) => {
  return `http://localhost:8080/${imagePath}`
}

// Načítanie položiek košíka pri načítaní komponentu
onMounted(async () => {
  try {
    orderItems.value = await orderItemService.getOrderItems()
  } catch {
    error.value = 'Nepodarilo sa načítať položky košíka.'
  } finally {
    loading.value = false

    // Mock prihlásenia (toto nahradiť reálnou autentifikáciou)
    user.value = new User('Test User', 'pass123', 'Test Street 123', 'test@test.com', 'USER')
    isLoggedIn.value = true
  }
})

// Zvýšenie množstva položky
const increaseQuantity = async (item: OrderItem) => {
  if (!item.product || item.quantity >= item.product.productQuantity+1) {
    alert('Nie je možné pridať viac kusov, než je dostupné.');
    return;
  }

  item.quantity++;
  item.itemPrice = item.quantity * (item.product.productPrice || 0);

  try {
    await orderItemService.updateOrderItem(item);
    await productService.updateProductQuantity(item.product.id, item.product.productQuantity - 1);
    item.product.productQuantity--;
    cartStore.triggerUpdate();
  } catch (err) {
    console.error('Chyba pri aktualizácii množstva produktu:', err);
  }
};

// Zníženie množstva položky
const decreaseQuantity = async (item: OrderItem) => {
  if (item.quantity > 1) {
    item.quantity--
    item.itemPrice = item.quantity * (item.product?.productPrice || 0)

    try {
      await orderItemService.updateOrderItem(item);
      await productService.updateProductQuantity(item.product.id, item.product.productQuantity + 1);
      item.product.productQuantity++;
      cartStore.triggerUpdate();
    } catch (err) {
      console.error('Chyba pri aktualizácii množstva produktu:', err);
    }
  } else {
    await removeItem(item.id)
  }
}

// Odstránenie položky z košíka
const removeItem = async (id?: number) => {
  if (id !== undefined) {
    try {
      const item = orderItems.value.find(i => i.id === id);
      if (item?.product) {
        await productService.updateProductQuantity(item.product.id, item.product.productQuantity + item.quantity);
      }

      await orderItemService.deleteOrderItem(id);
      orderItems.value = orderItems.value.filter((item) => item.id !== id);
      cartStore.triggerUpdate();
    } catch (err) {
      console.error('Chyba pri odstraňovaní položky', err);
    }
  }
}

const continueToCheckout = () => {
  if (orderItems.value.length > 0) {
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
  if (cartStore.getTotalQuantity() === 0) {
    alert('Košík je prázdny. Nie je možné vytvoriť objednávku.')
    return
  }

  if (user.value) {
    const newOrder = new Order(OrderStatus.CREATED)
    newOrder.orderItems = orderItems.value
    newOrder.recalculateTotalPrice()
    alert(
      `Objednávka bola vytvorená pre ${user.value.userName} s celkovou cenou ${newOrder.totalPrice.toFixed(2)} €.`,
    )
  }
  orderItems.value = []   // Vyprázdni položky košíka
      cartStore.clearCart()   // Vyprázdni store
      localStorage.removeItem('cartItems')
      console.log('Košík po objednávke:', orderItems.value)
console.log('Košík v localStorage:', localStorage.getItem('cartItems'))
console.log('Stav prihlásenia:', isLoggedIn.value)
}
</script>

<style scoped>
.cart-view {
  padding: 2rem;
  text-align: center;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.cart-table th,
.cart-table td {
  border: 1px solid #ccc;
  padding: 1rem;
  text-align: center;
}

button {
  margin: 0 0.5rem;
}

.checkout-details {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  text-align: left;
}

.total-price {
  margin: 1rem 0;
  font-size: 1.2rem;
  font-weight: bold;
}
.product-thumbnail {
  width: 75px;
  height: 75px;
  object-fit: cover;
  border-radius: 5px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
