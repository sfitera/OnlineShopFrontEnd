import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import axios from 'axios'

interface User {
  id?: number
  username: string
  userEmail?: string
  userAddress?: string
  roles: string[]
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.roles.includes('ADMIN'))

  const setUser = (userData: User, authToken: string) => {
    user.value = userData
    token.value = authToken
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', authToken)
    localStorage.setItem('username', userData.username)
  }

  const clearUser = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('username')
  }

  const fetchUserData = async () => {
    const storedUsername = localStorage.getItem('username')
    const storedToken = localStorage.getItem('token')

    if (!storedUsername || !storedToken) {
      console.warn("❌ Žiadny token alebo username, nemôžem načítať údaje používateľa!")
      return
    }

    try {
      console.log(`🔄 Načítavam údaje používateľa: ${storedUsername}`)
      const response = await axios.get(`http://localhost:8080/api/users/user-name/${storedUsername}`, {
        headers: { Authorization: `Bearer ${storedToken}` }
      })

      // Ošetrenie, aby vždy obsahovalo zoznam rolí
      user.value = {
        ...response.data,
        roles: response.data.roles || [] // Ak backend pošle null, nastavíme prázdne pole
      }
      console.log("✅ Používateľské údaje načítané z databázy:", user.value)
    } catch (error) {
      console.error("❌ Chyba pri načítaní používateľa z databázy:", error)
    }
  }

  watch(isLoggedIn, (newValue) => {
    console.log("🔄 Zmena stavu prihlásenia:", newValue)
  })

  return { user, token, isLoggedIn, isAdmin, setUser, fetchUserData, clearUser }
})
