<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { cartStore } from './stores/cartStore'
import { useRouter, useRoute } from 'vue-router'
import { Category } from '@/models/Product'

const router = useRouter()
const route = useRoute()
const categoryList = ref(Object.values(Category))
const cartItemCount = computed(() => cartStore.getTotalQuantity())
const searchQuery = ref('')

const formatCategoryName = (category: string) => {
  return category.replace('_', ' ').toUpperCase()
}

const updateCartCount = () => {
  cartItemCount.value = cartStore.getTotalQuantity()
}

const handleSearch = () => {
  router.push({ path: '/', query: { ...route.query, search: searchQuery.value } })
}
watch(searchQuery, handleSearch)

cartStore.subscribe(() => {
  console.log('Košík sa zmenil, počet položiek:', cartStore.getTotalQuantity())
})

onMounted(() => {
  updateCartCount()
  cartStore.subscribe(updateCartCount)
  cartStore.triggerUpdate()
})
</script>

<template>
  <div class="page-container">
    <!-- Header -->
    <header class="header">
      <nav class="nav">
        <RouterLink to="/">
          <img src="http://localhost:8080/images/shopLogo.jpg" alt="obrázok" class="logo-image" />
        </RouterLink>
        <div>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Vyhľadajte produkty..."
            class="search-bar"
          />
        </div>
        <RouterLink to="/cart/" class="nav-link"
          >Košík
          <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
        </RouterLink>

        <!-- Profilový dropdown -->
        <div class="dropdown">
          <button class="dropbtn">Profil</button>
          <div class="dropdown-content">
            <RouterLink to="/login" class="dropdown-item">Prihlásenie</RouterLink>
            <RouterLink to="/orders" class="dropdown-item">Moje objednávky</RouterLink>
          </div>
        </div>
      </nav>
    </header>

    <div class="content-wrapper">
      <aside class="sidebar left-sidebar">
        <router-link to="/" class="sidebar-btn">Domov</router-link>
        <router-link to="/about" class="sidebar-btn">O stránke</router-link>
        <h3>Kategórie</h3>
        <button
          @click="$router.push({ path: '/', query: { category: 'all' } })"
          class="category-btn"
        >
          Všetky produkty
        </button>
        <button
          v-for="category in categoryList"
          :key="category"
          @click="$router.push({ path: '/', query: { category } })"
          class="category-btn"
        >
          {{ formatCategoryName(category) }}
        </button>
      </aside>

      <main class="main-content">
        <RouterView />
      </main>

      <aside class="sidebar right-sidebar">
        <ul>
          <li><RouterLink to="/promo" class="sidebar-btn">Promo akcie</RouterLink></li>
          <li><RouterLink to="/support" class="sidebar-btn">Podpora</RouterLink></li>
        </ul>
      </aside>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <p>© 2025 Online Obchod. Všetky práva vyhradené.</p>
    </footer>
  </div>
</template>

<style scoped>
/* Všeobecné nastavenie layoutu */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background: linear-gradient(
    45deg,
    #1a1927,
    #1a1927,
    #fed40a,
    #87d72f,
    #00bde7,
    #cd0d63,
    #e81111,
    #fa8112
  );
  color: white;
  padding: 1rem;
  text-align: center;
}

.nav {
  grid-column: 1 / 4;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  color: white;
}

.nav-link {
  text-decoration: none;
  color: black;
  padding: 0.5rem 1rem;
}

.nav-link:hover {
  background-color: #007bff;
  border-radius: 5px;
}

/* Dropdown menu */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  background-color: #343a40;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #343a40;
  min-width: 160px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-item {
  color: white;
  padding: 12px 16px;
  display: block;
  text-decoration: none;
}

.dropdown-item:hover {
  background-color: #007bff;
}

/* Layout pre obsah */
.content-wrapper {
  display: flex;
  flex: 1;
  padding: 1rem;
}

.sidebar {
  width: 20%;
  background-color: #343a40;
  padding: 1rem;
}

.left-sidebar {
  background: white;
  padding: 1.5rem;
}

.right-sidebar {
  background: white;
  padding: 1.5rem;
}

.main-content {
  width: 60%;
  padding: 1rem;
  border: 1px solid #ddd;
}

/* Footer */
.footer {
  background: linear-gradient(
    45deg,
    #1a1927,
    #1a1927,
    #fed40a,
    #87d72f,
    #00bde7,
    #cd0d63,
    #e81111,
    #fa8112
  );
  color: white;
  text-align: center;
  padding: 1rem;
}

.cart-badge {
  background-color: red;
  color: white;
  font-size: 12px;
  border-radius: 50%;
  padding: 4px 6px;
  margin-left: 5px;
}

.logo-image {
  width: 75px;
  height: 75px;
  object-fit: cover;
  border-radius: 5px;
}
.sidebar-btn,
.category-btn {
  display: block;
  margin: 1rem 0;
  padding: 0.5rem;
  background: #00bde7;
  color: #cd0d63;
  text-align: left;
  border: none;
  width: 100%;
  cursor: pointer;
  font-weight: bold;
  border-radius: 8px;
}

.sidebar-btn:hover,
.category-btn:hover {
  background: #87d72f;
}

.category-section {
  margin-top: 2rem;
}

.search-bar {
  padding: 0.5rem;
  width: 200px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
