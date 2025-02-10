import { OrderItem } from './OrderItem';
//import { User } from './User';

export enum OrderStatus {
  CREATED = 'CREATED',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export class Order {
  id?: number;
  //user: User;
  totalPrice: number;
  orderDate: string;
  orderStatus: OrderStatus;
  orderItems: OrderItem[];

  //constructor(user: User, orderStatus: OrderStatus) {
  constructor(orderStatus: OrderStatus) {
    //this.user = user;
    this.totalPrice = 0;
    this.orderDate = new Date().toISOString().split('T')[0]; // Nastaví aktuálny dátum
    this.orderStatus = orderStatus;
    this.orderItems = [];
    }

   private setTotalPrice(orderItem: OrderItem): number {
    return orderItem.quantity * orderItem.itemPrice;
   }

    addOrderItem(orderItem: OrderItem): void {
    const itemPrice = this.setTotalPrice(orderItem);
    this.totalPrice += itemPrice;
    this.orderItems.push(orderItem);
    }

    recalculateTotalPrice(): void {
    this.totalPrice = this.orderItems.reduce((sum, item) => sum + item.itemPrice, 0);
    }
  }
