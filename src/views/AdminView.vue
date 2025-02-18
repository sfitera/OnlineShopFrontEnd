<template>
  <section class="admin-panel">
    <h1>Admin Panel</h1>

    <div class="admin-options">
      <button @click="navigateTo('products')">Správa produktov</button>
      <button @click="navigateTo('users')">Správa užívateľov</button>
      <button @click="navigateTo('orders')">Správa objednávok</button>
    </div>

    <router-view></router-view>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (section: string) => {
  router.push(`/admin/${section}`)
}
</script>

<style scoped>
.admin-panel {
  text-align: center;
  padding: 2rem;
}

.admin-options {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

button {
  background-color: #00bde7;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1rem;
}

button:hover {
  background-color: #008cbf;
}
</style>
