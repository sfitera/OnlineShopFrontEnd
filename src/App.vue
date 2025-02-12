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
        <div v-if="!isLoggedIn" class="auth-form">
          <h3>Prihlásenie</h3>
          <input v-model="loginData.email" type="email" placeholder="Email" />
          <input v-model="loginData.password" type="password" placeholder="Heslo" />
          <button @click="login">Prihlásiť</button>
          <p>Nemáte účet? <span @click="toggleRegister" class="link">Registrovať</span></p>

          <div v-if="showRegister">
            <h3>Registrácia</h3>
            <input v-model="registerData.userName" type="text" placeholder="Meno" />
            <input v-model="registerData.email" type="email" placeholder="Email" />
            <input v-model="registerData.password" type="password" placeholder="Heslo" />
            <input v-model="registerData.address" type="text" placeholder="Adresa" />
            <button @click="register">Registrovať</button>
          </div>
        </div>
        <div v-else>
          <h3>Vitaj, {{ user?.userName }}</h3>
          <p>Email: {{ user?.userEmail }}</p>
          <RouterLink to="/profile" class="nav-link">Profil</RouterLink>
          <RouterLink to="/cart/" class="nav-link">Košík</RouterLink>
          <button @click="logout">Odhlásiť</button>
        </div>
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
import { cartStore } from './stores/cartStore'
import { useRouter, useRoute } from 'vue-router'
import { Category } from '@/models/Product'
import { UserService } from '@/services/UserService';
import { User, UserRole } from '@/models/User';

const router = useRouter()
const route = useRoute()
const categoryList = ref(Object.values(Category))
const cartItemCount = computed(() => cartStore.getTotalQuantity())
const searchQuery = ref('')
const isLoggedIn = ref(false);
const user = ref<User | null>(null);
const userService = new UserService();
const showRegister = ref(false);
const loginData = ref({ email: '', password: '' });
const registerData = ref({ userName: '', email: '', password: '', address: '' });

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
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    user.value = JSON.parse(storedUser);
    isLoggedIn.value = true;
  }
  cartStore.triggerUpdate();
});

const login = async () => {
  try {
    const response = await userService.loginUser(loginData.value.email, loginData.value.password);

    if (response) {
      console.log("Úspešne prihlásený:", response);
      isLoggedIn.value = true;
      user.value = response;
      localStorage.setItem("user", JSON.stringify(response));
    } else {
      alert("Nesprávne prihlasovacie údaje.");
    }
  } catch (error) {
    console.error("Chyba pri prihlasovaní:", error);
    alert("Chyba pri prihlásení: " + error.response?.data || error.message);
  }
};

const register = async () => {
  try {
    const newUser = new User(
      registerData.value.userName,
      registerData.value.password,
      registerData.value.address,
      registerData.value.email,
      UserRole.USER
    );
    await userService.addUser(newUser);
    alert('Registrácia úspešná! Prihláste sa.');
    showRegister.value = false;
  } catch (error) {
    console.error('Chyba pri registrácii:', error);
  }
};

const logout = () => {
  isLoggedIn.value = false;
  user.value = null;
  localStorage.removeItem('user');
};

const toggleRegister = () => {
  showRegister.value = !showRegister.value;
};


</script>

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

.link {
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
}

.link:hover {
  color: #0056b3;
}
</style>
