<template>
  <section class="auth-container">
    <h1>Prihlásenie</h1>
    <div class="auth-form">
      <input v-model="loginData.username" type="text" placeholder="Používateľské meno" @keydown.enter="login"/>
      <input v-model="loginData.password" type="password" placeholder="Heslo" @keydown.enter="login" />
      <button @click="login">Prihlásiť sa</button>
      <p>Nemáte účet? <router-link to="/register" class="link">Registrovať</router-link></p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserService } from '@/services/UserService'
import { useUserStore } from '@/stores/userStore'
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const userService = new UserService()
const userStore = useUserStore()
const router = useRouter()
const loginData = ref({ username: '', password: '' })

const login = async () => {
  try {
    await authStore.login(loginData.value.username, loginData.value.password)
    router.push('/') // Presmerovanie po prihlásení
  } catch (error) {
    console.error("❌ Chyba pri prihlasovaní:", error)
  }
}
</script>

<style scoped>
.auth-container {
  text-align: center;
  padding: 2rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: auto;
}

input {
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
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
