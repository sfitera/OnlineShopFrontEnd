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

        <div v-if="isLoggedIn">
          <RouterLink to="/profile" class="nav-link">Profil</RouterLink>
          <RouterLink to="/" @click="logout" class="nav-link">Odhlásiť sa</RouterLink>
        </div>
        <div v-else>
          <RouterLink to="/login" class="nav-link">Prihlásiť sa</RouterLink>
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

      <!-- PRAVÝ SIDEBAR - Zobraziť len ak je užívateľ prihlásený -->
      <aside v-if="isLoggedIn" class="sidebar right-sidebar">
        <h3>Vitaj, {{ userStore.user?.username }}</h3>
        <p>Email: {{ userStore.user?.userEmail }}</p>
        <RouterLink to="/profile" class="sidebar-btn">Profil</RouterLink>
        <RouterLink to="/cart/" class="sidebar-btn">Košík</RouterLink>
        <RouterLink to="/orders" class="sidebar-btn">Moje objednávky</RouterLink>
        <RouterLink v-if="userStore.isAdmin" to="/admin" class="sidebar-btn"
          >Admin Panel</RouterLink
        >
        <RouterLink to="/" @click="logout" class="sidebar-btn">Odhlásiť sa</RouterLink>
      </aside>
    </div>

    <!-- Footer -->
    <footer class="footer">
      <p>© 2025 Online Obchod. Všetky práva vyhradené.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { Category } from '@/models/Product'
import { UserService } from '@/services/UserService'
import { User, UserRole } from '@/models/User'
import { useAuthStore } from '@/stores/authStore'
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cartStore'

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const userService = new UserService()
const categoryList = ref(Object.values(Category))
const cartItemCount = computed(() => cartStore.cartItemCount)
const searchQuery = ref('')
const showRegister = ref(false)
const loginData = ref({ email: '', password: '' })
const registerData = ref({ userName: '', email: '', password: '', address: '' })

// Overenie prihlásenia
const { isLoggedIn, user } = storeToRefs(userStore)

// Debugging logy
console.log('🏠 Aplikácia sa načítava...')
console.log('🔐 Užívateľ je prihlásený:', isLoggedIn.value)
console.log('👤 Užívateľské údaje:', userStore.user)

onMounted(() => {
  userStore.fetchUserData()
  if (!isLoggedIn.value) {
    userStore.fetchUserData()
    console.warn('🚨 Užívateľ nie je prihlásený!')
  } else {
    console.log('✅ Užívateľ je prihlásený:', userStore.user)
  }

  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    try {
      user.value = JSON.parse(storedUser)
      isLoggedIn.value = true
    } catch (error) {
      console.error('Chyba pri parsovaní JSON:', error)
      localStorage.removeItem('user') // Odstráň chybný JSON, aby sa chyba neopakovala
    }
  }
})

const formatCategoryName = (category: string) => {
  return category.replace('_', ' ').toUpperCase()
}

const updateCartCount = () => {
  cartItemCount.value = cartStore.getTotalQuantity()
}

watch(searchQuery, () => {
  router.push({ path: '/', query: { ...route.query, search: searchQuery.value } })
})

watch(
  () => cartStore.cartItemCount,
  (newCount) => {
    console.log('🔄 Počet položiek v košíku sa zmenil:', newCount)
  },
)

watch(cartStore.orderItems, () => {
  console.log('🛒 Aktualizácia počtu položiek v košíku:', cartItemCount.value)
})

const login = async () => {
  try {
    const response = await authStore.login(loginData.value.username, loginData.value.password)

    console.log('✅ Prihlasovací response:', response) // 🔍 Debugging
    userStore.setUser(response)

    router.push('/') // Presmerovanie po prihlásení
  } catch (error) {
    console.error('❌ Chyba pri prihlasovaní:', error)
  }
}

const register = async () => {
  try {
    const newUser = new User(
      registerData.value.userName,
      registerData.value.password,
      registerData.value.address,
      registerData.value.email,
      UserRole.USER,
    )
    await userService.addUser(newUser)
    alert('Registrácia úspešná! Prihláste sa.')
    showRegister.value = false
  } catch (error) {
    console.error('Chyba pri registrácii:', error)
  }
}

const logout = () => {
  userStore.clearUser()
  router.push('/')
}
</script>

<style scoped>
/* Všeobecné nastavenie layoutu */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
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
  padding: 1rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
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
  color: white;
  padding: 0.5rem 1rem;
  transition: background 0.3s ease-in-out;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 5px;
}

/* 📌 Pridáme `padding-top`, aby sa obsah neprekrýval s navbarom */
.content-wrapper {
  display: flex;
  flex: 1;
  padding-top: 80px; /* Kompenzuje fixný header */
}

.sidebar {
  width: 20%;
  background-color: #343a40;
  padding: 1rem;
}

/* 📌 Fixný ľavý sidebar */
.left-sidebar {
  position: fixed;
  top: 80px;
  left: 0;
  width: 20%;
  height: auto;
  max-height: calc(100vh - 80px); /* Obmedzenie na výšku okna */
  overflow-y: auto;
  background: white;
  padding: 1.5rem;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  padding-bottom: 80px; /* Priestor nad footerom */
}

/* 📌 Fixný pravý sidebar (len ak je používateľ prihlásený) */
.right-sidebar {
  position: fixed;
  top: 80px;
  right: 0;
  width: 20%;
  height: calc(100vh - 80px);
  overflow-y: auto;
  background: white;
  padding: 1.5rem;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
}

/* 📌 Hlavný obsah sa posunie doprava a vyplní stred */
.main-content {
  flex: 1;
  margin-left: 20%;
  margin-right: 20%;
  padding: 2rem;
  background: #f9f9f9;
  min-height: calc(100vh - 80px);
  overflow-y: auto;
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
  width: 100%;
  position: relative;
  bottom: 0;
  clear: both; /* Zabraňuje prekrývaniu */
}

/* 📌 Košík - vizuálna úprava */
.cart-badge {
  background-color: red;
  color: white;
  font-size: 12px;
  border-radius: 50%;
  padding: 4px 6px;
  margin-left: 5px;
}

/* 📌 Logo */
.logo-image {
  width: 75px;
  height: 75px;
  object-fit: cover;
  border-radius: 5px;
}
/* 📌 Sidebar tlačidlá */
.sidebar-btn,
.category-btn {
  display: block;
  margin: 1rem 0;
  padding: 0.5rem;
  background: #00bde7;
  color: white;
  text-align: left;
  border: none;
  width: 100%;
  cursor: pointer;
  font-weight: bold;
  border-radius: 8px;
  transition: background 0.3s ease-in-out;
}

.sidebar-btn:hover,
.category-btn:hover {
  background: #87d72f;
}

.category-section {
  margin-top: 2rem;
}

/* 📌 Vyhľadávací panel */
.search-bar {
  padding: 0.5rem;
  width: 200px;
  border-radius: 4px;
  border: 1px solid #ccc;
  transition: box-shadow 0.3s ease-in-out;
}

.search-bar:focus {
  box-shadow: 0px 0px 8px rgba(0, 189, 231, 0.5);
  outline: none;
}

/* 📌 Formuláre pre registráciu a prihlásenie */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.auth-form input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.auth-form button {
  background-color: #00bde7;
  color: white;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 8px;
}

.auth-form button:hover {
  background-color: #007bbf;
}

/* 📌 Odkazy */
.link {
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}

.link:hover {
  color: #0056b3;
}
</style>
