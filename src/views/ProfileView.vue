<template>
  <section class="profile">
    <h1>Môj profil</h1>
    <div v-if="user">
      <p><strong>Meno:</strong> {{ user.username }}</p>
      <p><strong>Email:</strong> {{ user.userEmail }}</p>
      <p><strong>Adresa:</strong> {{ user.userAddress }}</p>

      <h2>Zmeniť heslo</h2>
      <input v-model="currentPassword" type="password" placeholder="Aktuálne heslo" />
      <input v-model="newPassword" type="password" placeholder="Nové heslo" />
      <button @click="changePassword">Zmeniť heslo</button>
      <p v-if="message" class="message">{{ message }}</p>
    </div>
    <div v-else>
      <p>Načítavam údaje...</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { UserService } from '@/services/UserService'
import { User } from '@/models/User'

const userService = new UserService()
const user = ref<User | null>(null)
const currentPassword = ref('')
const newPassword = ref('')
const message = ref('')

onMounted(async () => {
  try {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }

    if (user.value && !user.value.id) {
      const response = await userService.getUserByUsername(user.value.username)
      user.value.id = response.id
    }

    if (!user.value) {
      alert('Používateľské údaje neboli načítané!')
    }
  } catch (error) {
    console.error('Chyba pri načítaní profilu:', error)
  }
})

const changePassword = async () => {
  try {
    if (!user.value || !user.value.id) {
      alert('User ID nie je dostupné!')
      return
    }
    await userService.updatePassword(user.value.id, currentPassword.value, newPassword.value)
    alert('Heslo bolo úspešne zmenené!')
  } catch (error) {
    console.error('Chyba pri zmene hesla:', error)
    alert('Nepodarilo sa zmeniť heslo.')
  }
}
</script>

<style scoped>
.profile {
  padding: 2rem;
  text-align: center;
}

input {
  display: block;
  margin: 0.5rem auto;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 250px;
}

button {
  background-color: #00bde7;
  color: white;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 8px;
}

.message {
  margin-top: 1rem;
  font-weight: bold;
}
</style>
