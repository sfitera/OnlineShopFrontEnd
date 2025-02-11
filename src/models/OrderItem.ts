import { Product } from './Product'

export class OrderItem {
  id?: number
  productId?: number
  quantity: number
  itemPrice: number

  constructor(product: Product, quantity: number) {
    this.productId = product.id
    this.quantity = quantity
    this.itemPrice = product.productPrice * quantity
  }
}
