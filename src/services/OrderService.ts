import axios from 'axios'
import { Order } from '../models/Order'
import { useUserStore } from '@/stores/userStore'

const orderUrl = 'http://localhost:8080/api/orders/'

export class OrderService {
  getAuthHeaders() {
    const store = useUserStore()
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: store.token ? `Bearer ${store.token}` : '',
      },
    }
  }

  async createOrder(order: Order): Promise<Order> {
    const response = await axios.post(`${orderUrl}create`, order, this.getAuthHeaders()) // ✅ Pridaná autentifikácia!
    return response.data
  }

  async updateOrder(order: Order): Promise<void> {
    const response = await axios.patch(
      `${orderUrl}update/${order.id}`,
      { orderStatus: order.orderStatus }, // ✅ Pošleme iba status!
      this.getAuthHeaders(),
    )
    return response.data
  }

  async deleteOrder(id: number): Promise<void> {
    await axios.delete(`${orderUrl}delete/${id}`, this.getAuthHeaders())
  }

  async getOrderById(id: number): Promise<Order> {
    const response = await axios.get(`${orderUrl}${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  }

  async getOrders(): Promise<Order[]> {
    const response = await axios.get(orderUrl, this.getAuthHeaders())
    return response.data
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    const response = await axios.get(`${orderUrl}order/${userId}`, this.getAuthHeaders()) // ✅ Oprava URL!
    return response.data
  }
}
