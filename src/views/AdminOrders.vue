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
              <button @click="editOrder(order)" class="action-button">Upraviť</button>
              <button @click="deleteOrder(order.id)" class="action-button delete-button">
                Zmazať
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

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
import { ref, onMounted } from 'vue'
import { OrderService } from '@/services/OrderService'
import { Order } from '@/models/Order'

const orderService = new OrderService()
const orders = ref<Order[]>([])
const showEditModal = ref(false)
const editedOrder = ref<Order | null>(null)

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

// ✅ Formátovanie dátumu
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('sk-SK', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
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


onMounted(fetchOrders)
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
