import { defineStore } from 'pinia'
import { useUserStore } from '@/stores/userStore'
import axios from 'axios'

interface LoginResponse {
  token: string
  username: string
  roles: string[]
}

export const useAuthStore = defineStore('auth', {
  actions: {
    async login(username: string, password: string) {
      try {
        console.log("🔐 Posielam prihlasovací request...")

        const payload = { username, password }
        const response = await axios.post<LoginResponse>('http://localhost:8080/api/auth/signin', payload, {
          headers: { 'Content-Type': 'application/json' }
        })

        if (response.status === 200) {
          console.log("✅ Prihlásenie úspešné, nastavujem používateľa...")

          const userStore = useUserStore()
          const token = response.data.token
          const userData = { username: response.data.username }

          // Uloženie používateľa a tokenu
          userStore.setUser(userData, token)
          await userStore.fetchUserData()
        } else {
          console.error("❌ Prihlásenie zlyhalo:", response.statusText)
        }
      } catch (error) {
        console.error("❌ Chyba pri prihlasovaní:", error)
      }
    },
    logout() {
      console.log("🚪 Odhlasujem používateľa...")
      const userStore = useUserStore()
      userStore.clearUser()
    }
  }
})
