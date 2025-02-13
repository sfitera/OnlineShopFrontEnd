<template>
  <section class="profile-container">
    <div class="profile-card">
      <h1 class="profile-title">👤 Môj profil</h1>

      <div v-if="userStore.user" class="profile-info">
        <!-- Profilové údaje -->
        <div class="user-details">
          <p><strong>Meno:</strong> {{ userStore.user.username }}</p>
          <p><strong>Email:</strong> {{ userStore.user.userEmail }}</p>
          <p><strong>Adresa:</strong> {{ userStore.user.userAddress }}</p>
        </div>

        <!-- Sekcia na zmenu hesla -->
        <div class="password-section">
          <h2>🔑 Zmeniť heslo</h2>
          <input v-model="currentPassword" type="password" placeholder="Aktuálne heslo" class="input-field" />
          <input v-model="newPassword" type="password" placeholder="Nové heslo" class="input-field" />
          <button @click="changePassword" class="update-btn">Zmeniť heslo</button>
          <p v-if="message" class="message">{{ message }}</p>
        </div>
      </div>

      <div v-else class="loading-message">
        <p>⏳ Načítavam údaje...</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { UserService } from '@/services/UserService'
import { useUserStore } from '@/stores/userStore'
import axios from 'axios'

const userStore = useUserStore()
const currentPassword = ref('')
const newPassword = ref('')
const message = ref('')
const userService = new UserService()

onMounted(async () => {
  if (!userStore.user) {
    console.log("🛠 Používateľské údaje nie sú načítané, skúšam ich načítať...")
    await userStore.fetchUserData()
  }
})

const changePassword = async () => {
  try {
    if (!userStore.user?.id) {
      alert('❌ User ID nie je dostupné!')
      return
    }
    await axios.patch(`http://localhost:8080/api/users/update-password`, {
      userId: userStore.user.id,
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    })
    message.value = '✅ Heslo bolo úspešne zmenené!'
    setTimeout(() => (message.value = ''), 3000)
  } catch (error) {
    console.error('❌ Chyba pri zmene hesla:', error)
    message.value = '❌ Nepodarilo sa zmeniť heslo.'
  }
}
</script>

<style scoped>
/* 🏠 Celkové rozloženie */
.profile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #f8f9fa;
}

/* 📌 Karta profilu */
.profile-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  text-align: center;
}

/* 📝 Nadpisy */
.profile-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
}

.password-section h2 {
  font-size: 1.4rem;
  margin-top: 1.5rem;
  color: #007bb5;
}

/* 📄 Profilové údaje */
.user-details p {
  font-size: 1.2rem;
  margin: 0.5rem 0;
  color: #555;
}

/* ✏️ Vstupné polia */
.input-field {
  width: 90%;
  padding: 0.7rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  text-align: center;
}

/* 🔘 Tlačidlá */
.update-btn {
  background-color: #00bde7;
  color: white;
  border: none;
  padding: 0.8rem;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1rem;
  width: 100%;
  transition: background 0.3s ease-in-out;
}

.update-btn:hover {
  background-color: #007bb5;
}

/* 📩 Správy */
.message {
  margin-top: 1rem;
  font-weight: bold;
  font-size: 1rem;
  color: #10b981;
}

/* ⏳ Načítavanie */
.loading-message p {
  font-size: 1.2rem;
  color: #555;
}
</style>
