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
        console.log('🔐 Posielam prihlasovací request...')

        const response = await axios.post<LoginResponse>(
          'http://localhost:8080/api/auth/signin',
          { username, password },
          { headers: { 'Content-Type': 'application/json' } },
        )

        if (response.status === 200) {
          console.log('✅ Prihlásenie úspešné, nastavujem token...', response.data)

          const userStore = useUserStore()
          const token = response.data.token

          // 🔥 Po získaní tokenu načítame **celé** dáta o používateľovi
          const userResponse = await axios.get(
            `http://localhost:8080/api/users/user-name/${username}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )

          console.log('✅ Úspešne načítané dáta používateľa:', userResponse.data)

          const userData = {
            id: userResponse.data.id, // 🔥 Dôležité!
            username: userResponse.data.username,
            userEmail: userResponse.data.userEmail,
            userAddress: userResponse.data.userAddress,
            userRoles: userResponse.data.userRoles ?? [],
          }

          // Uloženie používateľa a tokenu
          userStore.setUser(userData, token)

          console.log('✅ Uložené dáta:', userData) // Debugging

          await userStore.fetchUserData()
        } else {
          console.error('❌ Prihlásenie zlyhalo:', response.statusText)
        }
      } catch (error) {
        console.error('❌ Chyba pri prihlasovaní:', error)
      }
    },

    logout() {
      console.log('🚪 Odhlasujem používateľa...')
      const userStore = useUserStore()
      userStore.clearUser()
    },
  },
})
