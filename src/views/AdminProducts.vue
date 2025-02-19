<template>
  <section class="admin-products">
    <h2>Správa produktov</h2>
    <button @click="showAddModal = true" class="action-button">Pridať produkt</button>

    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Názov</th>
          <th>Cena</th>
          <th>Pocet</th>
          <th>Dostupnost</th>
          <th>Autor</th>
          <th>Popis</th>
          <th>Kategoria</th>
          <th>Akcie</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.productName }}</td>
          <td>{{ product.productPrice }} €</td>
          <td>{{ product.productQuantity }}</td>
          <td>{{ product.productAvailability }}</td>
          <td>{{ product.productAuthor }}</td>
          <td>{{ product.productDescription }}</td>
          <td>{{ product.productCategory }}</td>
          <td>
            <div class="action-buttons">
              <button @click="editProduct(product)" class="action-button">Upraviť</button>
              <button @click="showDeleteModal(product)" class="action-button delete-button">
                Zmazať
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- MODÁLNE OKNO NA ÚPRAVU PRODUKTU -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Upraviť produkt</h3>
        <input v-model="editedProduct.productName" placeholder="Názov" />
        <input v-model="editedProduct.productPrice" type="number" placeholder="Cena" />
        <input v-model="editedProduct.productQuantity" type="number" placeholder="Počet kusov" />
        <input v-model="editedProduct.productAuthor" placeholder="Autor" />
        <textarea v-model="editedProduct.productDescription" placeholder="Popis"></textarea>
        <select v-model="editedProduct.productCategory">
          <option v-for="category in categoryList" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <input type="file" @change="handleImageUpload" />
        <button @click="saveEdit" class="action-button">Uložiť</button>
        <button @click="showEditModal = false" class="action-button delete-button">Zrušiť</button>
      </div>
    </div>

    <!-- MODÁLNE OKNO NA PRIDANIE PRODUKTU -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>Pridať produkt</h3>
        <input v-model="newProduct.productName" placeholder="Názov" required />
        <input v-model="newProduct.productPrice" type="number" placeholder="Cena" required />
        <input
          v-model="newProduct.productQuantity"
          type="number"
          placeholder="Počet kusov"
          required
        />
        <input v-model="newProduct.productAuthor" placeholder="Autor" required />
        <textarea v-model="newProduct.productDescription" placeholder="Popis" required></textarea>
        <select v-model="newProduct.productCategory">
          <option v-for="category in categoryList" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <input type="file" @change="handleNewImageUpload" />
        <button @click="addProduct" class="action-button">Pridať</button>
        <button @click="showAddModal = false" class="action-button delete-button">Zrušiť</button>
      </div>
    </div>

    <!-- MODÁLNE OKNO NA ZMAZANIE -->
    <div v-if="showDeleteModalFlag" class="modal">
      <div class="modal-content">
        <h3>Naozaj chcete zmazať tento produkt?</h3>
        <button @click="deleteProduct">Áno</button>
        <button @click="showDeleteModalFlag = false">Nie</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ProductService } from '@/services/ProductService'
import { Product, Category } from '@/models/Product'

const productService = new ProductService()
const products = ref<Product[]>([])
const showEditModal = ref(false)
const showAddModal = ref(false)
const showDeleteModalFlag = ref(false)
const editedProduct = ref<Product | null>(null)
const newProduct = ref<Product>({
  productName: '',
  productPrice: 0,
  productQuantity: 0,
  productImage: '',
  productCategory: Category.ART,
  productAuthor: '',
  productDescription: '',
} as Product)
const selectedProductId = ref<number | null>(null)

// ✅ Získame všetky kategórie z ENUMU
const categoryList = ref<string[]>(Object.values(Category))

const fetchProducts = async () => {
  products.value = await productService.getProducts()
}

// ✅ ÚPRAVA PRODUKTU
const editProduct = (product: Product) => {
  editedProduct.value = { ...product }
  showEditModal.value = true
}

const saveEdit = async () => {
  if (!editedProduct.value) return

  try {
    await productService.updateProduct(editedProduct.value, editedProduct.value.productQuantity)
    showEditModal.value = false
    fetchProducts() // 🔄 Aktualizujeme zoznam produktov
  } catch (error) {
    console.error('❌ Chyba pri úprave produktu:', error)
    alert('Nepodarilo sa upraviť produkt.')
  }
}

const addProduct = async () => {
  if (
    !newProduct.value.productName ||
    !newProduct.value.productPrice ||
    !newProduct.value.productQuantity
  ) {
    alert('Vyplňte všetky povinné polia!')
    return
  }

  try {
    await productService.addProduct(newProduct.value)
    showAddModal.value = false
    fetchProducts() // 🔄 Aktualizujeme zoznam produktov
    resetNewProduct()
  } catch (error) {
    console.error('❌ Chyba pri pridávaní produktu:', error)
    alert('Nepodarilo sa pridať produkt.')
  }
}

// ✅ RESET FORMULÁRA PO PRIDANÍ
const resetNewProduct = () => {
  newProduct.value = {
    productName: '',
    productPrice: 0,
    productQuantity: 0,
    productImage: '',
    productCategory: Category.ART,
    productAuthor: '',
    productDescription: '',
  } as Product
}

// ✅ VYMAZANIE PRODUKTU
const showDeleteModal = (product: Product) => {
  selectedProductId.value = product.id
  showDeleteModalFlag.value = true
}

const deleteProduct = async () => {
  if (selectedProductId.value !== null) {
    await productService.deleteProduct(selectedProductId.value)
    showDeleteModalFlag.value = false
    fetchProducts()
  }
}

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    editedProduct.value!.productImage = `images/${file.name}`
  }
}

const handleNewImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    newProduct.value.productImage = `images/${file.name}`
  }
}

onMounted(fetchProducts)
</script>

<style scoped>
.admin-products {
  text-align: center;
  padding: 2rem;
}

/* ✅ Lepšia tabuľka */
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

/* ✅ Tlačidlá pre pridanie, úpravu a vymazanie */
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

/* ✅ Štýl modálnych okien */
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

.modal-content input,
.modal-content textarea,
.modal-content select {
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
