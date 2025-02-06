import axios from 'axios';
import { Product } from '../models/Product';

const productUrl = 'http://localhost:8080/api/products/';

export class ProductService {
  async getProducts(): Promise<Product[]> {
    const response = await axios.get(productUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
    return response.data;
  }
}
