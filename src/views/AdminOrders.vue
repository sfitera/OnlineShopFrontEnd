<template>
  <section class="admin-orders">
    <h2>Správa objednávok</h2>

    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Dátum</th>
          <th>Celková cena</th>
          <th>Stav</th>
          <th>Akcie</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ formatDate(order.orderDate) }}</td>
          <td>{{ order.totalPrice.toFixed(2) }} €</td>
          <td>
            <span :class="statusClass(order.orderStatus)">{{ order.orderStatus }}</span>
          </td>
          <td>
            <div class="action-buttons">
              <button @click="toggleDetails(order.id)" class="action-button">
                {{ expandedOrder === order.id ? 'Skryť' : 'Detaily' }}
              </button>
              <button @click="editOrder(order)" class="action-button">Upraviť</button>
              <button @click="deleteOrder(order.id)" class="action-button delete-button">
                Zmazať
              </button>
            </div>
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
                <img :src="getProductImageUrl(item.product?.productImage)" alt="Produktový obrázok"
                  class="product-thumbnail"/>
              </RouterLink>
            </td>
            <td>
              <RouterLink :to="`/products/${item.product?.id}`" class="product-link">
                {{ item.product?.productName }}
              </RouterLink>
            </td>
            <td>{{ item.product?.productPrice.toFixed(2) }} €</td>
            <td>{{ item.quantity }}</td>
            <td>{{ item.itemPrice.toFixed(2) }} €</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODÁLNE OKNO NA ÚPRAVU -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Upraviť objednávku</h3>
        <label for="status">Stav objednávky:</label>
        <select v-model="editedOrder.orderStatus">
          <option value="PAID">Zaplatená</option>
          <option value="SHIPPED">Odoslaná</option>
          <option value="DELIVERED">Doručená</option>
          <option value="CANCELLED">Zrušená</option>
        </select>
        <button @click="saveEdit" class="action-button">Uložiť</button>
        <button @click="showEditModal = false" class="action-button delete-button">Zrušiť</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { OrderService } from '@/services/OrderService'
import { Order } from '@/models/Order'

const orderService = new OrderService()
const orders = ref<Order[]>([])
const showEditModal = ref(false)
const editedOrder = ref<Order | null>(null)
const expandedOrder = ref<number | null>(null)

// ✅ Načítanie objednávok zo servera
const fetchOrders = async () => {
  try {
    orders.value = await orderService.getOrders()
  } catch (error) {
    console.error('❌ Chyba pri načítaní objednávok:', error)
  }
}

// ✅ Otvorenie modálneho okna na úpravu
const editOrder = (order: Order) => {
  editedOrder.value = { ...order } // Kopírujeme objekt, aby sme nemenili pôvodný
  showEditModal.value = true
}

// ✅ Uloženie upravenej objednávky
const saveEdit = async () => {
  if (!editedOrder.value) return

  try {
    await orderService.updateOrder({
      id: editedOrder.value.id,
      orderStatus: editedOrder.value.orderStatus, // ✅ Pošleme iba status!
    } as Order)

    showEditModal.value = false
    fetchOrders() // 🔄 Aktualizujeme zoznam objednávok
  } catch (error) {
    console.error('❌ Chyba pri úprave objednávky:', error)
    alert('Nepodarilo sa uložiť zmeny.')
  }
}

// ✅ Odstránenie objednávky
const deleteOrder = async (id: number) => {
  if (confirm('Naozaj chcete zmazať túto objednávku?')) {
    try {
      await orderService.deleteOrder(id)
      fetchOrders()
    } catch (error) {
      console.error('❌ Chyba pri odstraňovaní objednávky:', error)
    }
  }
}

// 📌 Formátovanie dátumu
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('sk-SK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
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

const statusClass = (status: string) => {
  return {
    'status-created': status === 'CREATED',
    'status-paid': status === 'PAID',
    'status-shipped': status === 'SHIPPED',
    'status-delivered': status === 'DELIVERED',
    'status-cancelled': status === 'CANCELLED'
  }
}


onMounted(async () => {
  try {
    orders.value = await orderService.getOrders()
  } catch (error) {
    console.error('❌ Chyba pri načítaní objednávok:', error)
  }
})
</script>

<style scoped>
.admin-orders {
  text-align: center;
  padding: 2rem;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background: white;
  border-radius: 10px;
  overflow: hidden;
}

.admin-table th,
.admin-table td {
  border: 1px solid #ddd;
  padding: 1rem;
  text-align: center;
}

.admin-table th {
  background: #00bde7;
  color: white;
  text-transform: uppercase;
  font-weight: bold;
}

.admin-table tbody tr:hover {
  background: #f5f5f5;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.action-button {
  background-color: #00bde7;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 8px;
  font-weight: bold;
  transition: 0.3s;
}

.action-button:hover {
  background-color: #007bbf;
}

.delete-button {
  background-color: #e81111;
}

.delete-button:hover {
  background-color: #c50b0b;
}

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

/* ✅ Štýl modálneho okna */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  width: 400px;
}

.modal-content select {
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}

/* 🎨 Status objednávky - farebné štítky */
.status-created {
  background: #f7d048;
  color: black;
  padding: 5px 10px;
  border-radius: 12px;
}
.status-paid {
  background: #5dc1b9;
  color: black;
  padding: 5px 10px;
  border-radius: 12px;
}
.status-shipped {
  background: #ff9800;
  color: white;
  padding: 5px 10px;
  border-radius: 12px;
}
.status-delivered {
  background: #4caf50;
  color: white;
  padding: 5px 10px;
  border-radius: 12px;
}
.status-cancelled {
  background: #e81123;
  color: white;
  padding: 5px 10px;
  border-radius: 12px;
}
</style>
