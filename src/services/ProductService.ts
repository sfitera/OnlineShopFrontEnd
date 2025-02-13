import axios from 'axios'
import { Product } from '../models/Product'

const productUrl = 'http://localhost:8080/api/products/'

export class ProductService {

  async addProduct(product: Product): Promise<Product> {
    const response = await axios.post(`${productUrl}add/`, product, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  }

  async updateProduct(product: Product, newQuantity: number): Promise<void> {
    try {
      const updatedProduct = { ...product, productQuantity: newQuantity }; // ✅ Posielame celý objekt
      await axios.patch(`http://localhost:8080/api/product/update/${product.id}`, updatedProduct);
      console.log(`✅ Množstvo produktu ${product.id} aktualizované na ${newQuantity}`);
    } catch (error) {
      console.error(`❌ Chyba pri aktualizácii množstva produktu ${product.id}:`, error);
    }
  }


  async deleteProduct(id: number): Promise<void> {
    await axios.delete(`${productUrl}delete/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  async getProductById(id: number): Promise<Product> {
    const response = await axios.get(`${productUrl}${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  }

  async getProductByName(name: string): Promise<Product> {
    const response = await axios.get(`${productUrl}name/${name}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await axios.get(`${productUrl}category/${category}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })
    return response.data
  }

  async getProductsByPrice(price: number): Promise<Product[]> {
    const response = await axios.get(`${productUrl}price/${price}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })
    return response.data
  }

  async getProductsByAuthor(author: string): Promise<Product[]> {
    const response = await axios.get(`${productUrl}author/${author}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })
    return response.data
  }

  async getProductsByQuantity(quantity: number): Promise<Product[]> {
    const response = await axios.get(`${productUrl}quantity/${quantity}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })
    return response.data
  }

  async getProducts(): Promise<Product[]> {
    const response = await axios.get(productUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })
    return response.data
  }

  async updateProductQuantity(id: number, quantity: number): Promise<Product> {
    const response = await axios.patch(`${productUrl}update-quantity/${id}?quantity=${quantity}`, null, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.data
  }











}
