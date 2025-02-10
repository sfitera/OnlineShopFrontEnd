import axios from "axios";
import { OrderItem } from "../models/OrderItem";

const orderItemUrl = "http://localhost:8080/api/orderitem/";

export class OrderItemService {

  async addOrderItem(orderItem: OrderItem): Promise<OrderItem> {
    const response = await axios.post(`${orderItemUrl}add/`, orderItem, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  async updateOrderItem(orderItem: OrderItem): Promise<OrderItem> {
    const response = await axios.patch(`${orderItemUrl}update/${orderItem.id}?quantity=${orderItem.quantity}`, null, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }


  async deleteOrderItem(id: number): Promise<void> {
    await axios.delete(`${orderItemUrl}delete/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getOrderItemById(id: number): Promise<OrderItem> {
    const response = await axios.get(`${orderItemUrl}${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  async getOrderItems(): Promise<OrderItem[]> {
    const response = await axios.get(orderItemUrl, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });
    return response.data;
  }
}
