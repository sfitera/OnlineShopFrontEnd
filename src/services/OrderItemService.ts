import axios from 'axios'
import { OrderItem } from '../models/OrderItem'
import { useCartStore } from '@/stores/cartStore'

const orderItemUrl = 'http://localhost:8080/api/orderitem/'

export class OrderItemService {
  async addOrderItem(orderItem: OrderItem): Promise<OrderItem> {
    try {
      const response = await axios.post(`${orderItemUrl}add/`, orderItem, {
        headers: { 'Content-Type': 'application/json' }
      });

      console.log("📡 Odpoveď zo servera (pridanie do košíka):", response.data);

      if (!response.data || !response.data.product) {
        console.error("❌ Chyba: Backend nevrátil platný objekt `OrderItem`!", response.data);
        return Promise.reject("Backend nevrátil platný produkt.");
      }

      return response.data;
    } catch (error) {
      console.error("❌ Chyba pri pridávaní do košíka:", error);
      throw error;
    }
  }


  async updateOrderItem(orderItem: OrderItem): Promise<void> {
    console.log("🛒 PATCH Aktualizujem OrderItem:", orderItem);
    const cartStore = useCartStore();
    try {
      const response = await axios.patch(
        `${orderItemUrl}update/${orderItem.id}`,
        { quantity: orderItem.quantity }
      );
      console.log("✅ OrderItem úspešne aktualizovaný:", response.data);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        console.warn(`⚠️ Položka ${orderItem.id} neexistuje v databáze. Odstránim ju z košíka.`);
        cartStore.orderItems = cartStore.orderItems.filter(i => i.id !== orderItem.id);
        cartStore.updateCart();
      } else {
        console.error(`❌ Chyba pri aktualizácii položky ${orderItem.id}:`, error);
      }
    }
  }


  async deleteOrderItem(id: number): Promise<void> {
    const cartStore = useCartStore(); // Zavolaj useCartStore() vnútri metódy
    try {
      await axios.delete(`${orderItemUrl}delete/${id}`);
      console.log(`✅ Položka odstránená: ${id}`);

      const newItems = cartStore.orderItems.filter(item => item.id !== id);
      cartStore.setCartItems([...newItems]);
    } catch (error: any) {
      console.error(`❌ Chyba pri odstraňovaní položky ${id}:`, error);
    }
  }







  async getOrderItemById(id: number): Promise<OrderItem> {
    const response = await axios.get(`${orderItemUrl}${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  }

  async getOrderItems(): Promise<OrderItem[]> {
    try {
      const response = await axios.get(orderItemUrl);
      console.log("📡 API odpoveď (položky košíka):", response.data);

      if (response.data && response.data.length > 0) {
        return response.data;
      }

      return []; // Ak API nevráti nič, vráť prázdne pole (nechaj Vue to spracovať správne)
    } catch (error) {
      console.error("❌ Chyba pri načítaní položiek košíka:", error);
      return [];
    }
  }




  async clearCart(userId: number): Promise<void> {
    await axios.delete(`${orderItemUrl}clear-cart/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}
