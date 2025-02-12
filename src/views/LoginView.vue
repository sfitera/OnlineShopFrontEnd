<template>
  <section class="auth-container">
    <h1>Prihlásenie</h1>
    <div class="auth-form">
      <input v-model="loginData.email" type="email" placeholder="Email" />
      <input v-model="loginData.password" type="password" placeholder="Heslo" />
      <button @click="login">Prihlásiť sa</button>
      <p>Nemáte účet? <router-link to="/register" class="link">Registrovať</router-link></p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UserService } from '@/services/UserService'

const userService = new UserService()
const router = useRouter()
const loginData = ref({ email: '', password: '' })

const login = async () => {
  try {
    const response = await userService.loginUser(loginData.value.email, loginData.value.password)
    if (response) {
      console.log('Úspešne prihlásený:', response)
      localStorage.setItem('user', JSON.stringify(response))
      router.push('/cart') // 🔄 Po prihlásení presmeruj do košíka
    } else {
      alert('Nesprávne prihlasovacie údaje.')
    }
  } catch (error) {
    console.error('Chyba pri prihlasovaní:', error)
    alert('Chyba pri prihlásení: ' + error.response?.data || error.message)
  }
}

onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    console.log('Prihlásený používateľ:', JSON.parse(storedUser))
  }
})
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
