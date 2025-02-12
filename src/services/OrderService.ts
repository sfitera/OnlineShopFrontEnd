import axios from 'axios'
import { Order } from '../models/Order'

const orderUrl = 'http://localhost:8080/api/orders/'

export class OrderService {
  async addOrder(order: Order): Promise<Order> {
    const response = await axios.post(`${orderUrl}create/`, order, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  }

  async updateOrder(order: Order): Promise<Order> {
    const response = await axios.patch(`${orderUrl}update/${order.id}`, order, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  }

  async deleteOrder(id: number): Promise<void> {
    await axios.delete(`${orderUrl}delete/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
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
    const response = await axios.get(orderUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })
    return response.data
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    const response = await axios.get(`${orderUrl}order/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })
    return response.data
  }

}
