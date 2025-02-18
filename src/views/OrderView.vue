<template>
  <section class="orders">
    <h1>Moje objednávky</h1>

    <div v-if="loading">🔄 Načítavam objednávky...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="orders.length === 0">❌ Žiadne objednávky.</div>

    <table v-else class="order-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Dátum</th>
          <th>Stav</th>
          <th>Celková cena</th>
          <th>Detaily</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id" @click="toggleDetails(order.id)">
          <td>#{{ order.id }}</td>
          <td>{{ formatDate(order.orderDate) }}</td>
          <td>
            <span :class="statusClass(order.orderStatus)">{{ order.orderStatus }}</span>
          </td>
          <td>{{ order.totalPrice.toFixed(2) }} €</td>
          <td>
            <button @click.stop="toggleDetails(order.id)">
              {{ expandedOrder === order.id ? 'Skryť' : 'Zobraziť' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Detaily objednávky -->
    <div v-if="expandedOrder" class="order-details">
      <h2>🛒 Detaily objednávky #{{ expandedOrder }}</h2>
      <table class="details-table">
        <thead>
          <tr>
            <th>Obrázok</th>
            <th>Produkt</th>
            <th>Cena za kus</th>
            <th>Množstvo</th>
            <th>Celková cena</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in selectedOrder?.orderItems" :key="item.id">
            <td>
              <RouterLink :to="`/products/${item.product?.id}`">
              <img
                :src="getProductImageUrl(item.product?.productImage)"
                alt="Produktový obrázok"
                class="product-thumbnail"
              />
            </RouterLink>
            </td>
            <td>
            <RouterLink :to="`/products/${item.product?.id}`" class="product-link">{{ item.product?.productName }}</RouterLink></td>
            <td>{{ item.product?.productPrice.toFixed(2) }} €</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.itemPrice.toFixed(2) }} €</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Order } from '@/models/Order'
import { OrderService } from '@/services/OrderService'
import { useUserStore } from '@/stores/userStore'

const orderService = new OrderService()
const userStore = useUserStore()
const orders = ref<Order[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)
const expandedOrder = ref<number | null>(null)

onMounted(async () => {
  console.log("🔄 [OrderView] Overujem používateľa...");
  userStore.fetchUserData(); // ✅ Načítame údaje používateľa

  console.log("👤 [OrderView] Užívateľ v userStore:", userStore.user);

  if (!userStore.user?.id) {
    console.error("❌ [OrderView] Používateľ nie je prihlásený!");
    error.value = '❌ Chyba: Používateľ nie je prihlásený.';
    return;
  }

  try {
    console.log(`🔍 Načítavam objednávky pre userId: ${userStore.user.id}`);
    orders.value = await orderService.getOrdersByUserId(userStore.user.id);
  } catch (err) {
    console.error('❌ Chyba pri načítaní objednávok:', err);
    error.value = '❌ Nepodarilo sa načítať objednávky.';
  } finally {
    loading.value = false;
  }
});




// 📌 Formátovanie dátumu
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('sk-SK')
}

// 📌 Triedy pre status objednávky
const statusClass = (status: string) => {
  return {
    'status-created': status === 'CREATED',
    'status-paid': status === 'PAID',
    'status-shipped': status === 'SHIPPED',
    'status-delivered': status === 'DELIVERED',
    'status-cancelled': status === 'CANCELLED'
  }
}

// 📌 Získanie aktuálne vybratej objednávky
const selectedOrder = computed(() =>
  orders.value.find((order) => order.id === expandedOrder.value)
)

// 📌 Prepínanie detailov objednávky
const toggleDetails = (orderId: number) => {
  expandedOrder.value = expandedOrder.value === orderId ? null : orderId
}

// 📌 Generovanie URL pre obrázok
const getProductImageUrl = (imagePath: string) => {
  return `http://localhost:8080/${imagePath}`
}
</script>

<style scoped>
/* 🎨 Celkové rozloženie sekcie objednávok */
.orders {
  max-width: 1200px;
  margin: auto;
  text-align: center;
  padding: 2rem;
}

/* 🏆 Štýlová tabuľka objednávok */
.order-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

/* 🏷 Štýl hlavičky tabuľky */
.order-table th {
  background: #00bde7;
  color: white;
  padding: 1rem;
  text-transform: uppercase;
}

/* 📦 Štýl riadkov tabuľky */
.order-table td {
  border-bottom: 1px solid #ddd;
  padding: 1rem;
  text-align: center;
}

/* 🔥 Zvýraznenie riadka pri hover */
.order-table tr:hover {
  background-color: #f9f9f9;
  transition: background 0.2s ease-in-out;
}

/* 🎨 Status objednávky - farebné štítky */
.status-created { background: #f7d048; color: black; padding: 5px 10px; border-radius: 12px; }
.status-paid { background: #5dc1b9; color: black; padding: 5px 10px; border-radius: 12px; }
.status-shipped { background: #ff9800; color: white; padding: 5px 10px; border-radius: 12px; }
.status-delivered { background: #4caf50; color: white; padding: 5px 10px; border-radius: 12px; }
.status-cancelled { background: #e81123; color: white; padding: 5px 10px; border-radius: 12px; }

/* 🎨 Sekcia detailov objednávky */
.order-details {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

/* 🖼 Produktové obrázky */
.product-thumbnail {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.2s ease-in-out;
}

.product-thumbnail:hover {
  transform: scale(1.1);
}

/* 📝 Tabuľka detailov objednávky */
.details-table {
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.details-table th {
  background: #00bde7;
  color: white;
  padding: 1rem;
}

.details-table td {
  border-bottom: 1px solid #ddd;
  padding: 1rem;
  text-align: center;
}

.details-table tr:hover {
  background-color: #f9f9f9;
  transition: background 0.2s ease-in-out;
}

/* 🔗 Odkazy na detail produktu */
.product-link {
  text-decoration: none;
  font-weight: bold;
  color: #333;
}

.product-link:hover {
  color: #007bff;
  text-decoration: underline;
}

/* 🔘 Štýlové tlačidlá */
button {
  background-color: #00bde7;
  color: white;
  border: none;
  padding: 0.7rem 1rem;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1rem;
  transition: background 0.3s;
}

button:hover {
  background-color: #007bb5;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
