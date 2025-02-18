<template>
  <section class="auth-container">
    <h1>Registrácia</h1>
    <div class="auth-form">
      <input v-model="registerData.username" type="text" placeholder="Meno" />
      <input v-model="registerData.email" type="email" placeholder="Email" />
      <input v-model="registerData.password" type="password" placeholder="Heslo" />
      <input v-model="registerData.address" type="text" placeholder="Adresa" />
      <button @click="register">Registrovať</button>
      <p>Máte už účet? <router-link to="/login" class="link">Prihlásiť sa</router-link></p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserService } from '@/services/UserService'
import { User, UserRole } from '@/models/User'

const userService = new UserService()
const router = useRouter()
const registerData = ref({ username: '', email: '', password: '', address: '' })

const register = async () => {
  try {
    const newUser = new User(
      registerData.value.username,
      registerData.value.password,
      registerData.value.address,
      registerData.value.email,
      [UserRole.USER],
    )
    await userService.addUser(newUser)
    alert('Registrácia úspešná! Prihláste sa.')
    router.push('/login')
  } catch (error) {
    console.error('Chyba pri registrácii:', error)
    alert('Nepodarilo sa zaregistrovať.')
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
