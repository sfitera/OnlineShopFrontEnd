<template>
  <section class="profile">
    <h1>Môj profil</h1>
    <div v-if="userStore.user">
      <p><strong>Meno:</strong> {{ userStore.user.username }}</p>
      <p><strong>Email:</strong> {{ userStore.user.userEmail }}</p>
      <p><strong>Adresa:</strong> {{ userStore.user.userAddress }}</p>

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
import { useUserStore } from '@/stores/userStore'
import axios from 'axios'

const userStore = useUserStore()
const profileData = ref(null)
const errorMessage = ref(null)
const userService = new UserService()
const user = ref<User | null>(null)
const currentPassword = ref('')
const newPassword = ref('')
const message = ref('')

onMounted(async () => {
  if (!userStore.user) {
    console.log("🛠 Používateľské údaje nie sú načítané, skúšam ich načítať...")
    await userStore.fetchUserData()
  }
})

const changePassword = async () => {
  try {
    if (!userStore.user?.id) {
      alert('User ID nie je dostupné!')
      return
    }
    await axios.patch(`http://localhost:8080/api/users/update-password`, {
      userId: userStore.user.id,
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    })
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
