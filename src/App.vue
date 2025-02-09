<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
  <div class="page-container">
    <!-- Header -->
    <header class="header">
      <nav class="nav">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/about" class="nav-link">About</RouterLink>
        <RouterLink to="/products/" class="nav-link">Products</RouterLink>

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

    <!-- Obsah stránky -->
    <div class="content-wrapper">
      <aside class="sidebar left-sidebar">
        <p>Navigácia vľavo</p>
        <ul>
          <li><RouterLink to="/category/electronics">Elektronika</RouterLink></li>
          <li><RouterLink to="/category/books">Knihy</RouterLink></li>
        </ul>
      </aside>

      <main class="main-content">
        <RouterView />
      </main>

      <aside class="sidebar right-sidebar">
        <p>Navigácia vpravo</p>
        <ul>
          <li><RouterLink to="/promo">Promo akcie</RouterLink></li>
          <li><RouterLink to="/support">Podpora</RouterLink></li>
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
  background-color: #343a40;
  color: white;
  padding: 1rem;
  text-align: center;
}

.nav {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.nav-link {
  text-decoration: none;
  color: white;
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
  
  padding: 1rem;

}

.left-sidebar {
  order: -1;
}

.main-content {
  width: 60%;
  padding: 1rem;
  border: 1px solid #ddd;
}

/* Footer */
.footer {
  background-color: #343a40;
  color: white;
  text-align: center;
  padding: 1rem;
}
</style>
