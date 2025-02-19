import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

interface User {
  id?: number
  username: string
  userEmail?: string
  userAddress?: string
  userRoles: string[]
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isLoggedIn = computed(() => !!user.value)
  const isAdmin = computed(() => {
    console.log('🔍 Kontrola admin statusu...', user.value?.userRoles) // Debug
    return user.value?.userRoles?.includes('ADMIN') ?? false
  })

  const setUser = (userData: User, newToken: string) => {
    console.log('🔄 Nastavujem používateľa...', userData)

    user.value = {
      ...userData,
      userRoles: userData.userRoles ?? [], // ✅ Ak nie sú roly, nastavíme prázdne pole
    }

    token.value = newToken
    localStorage.setItem('user', JSON.stringify(user.value))
    localStorage.setItem('token', newToken)

    console.log('✅ Používateľ nastavený:', user.value)
  }

  const clearUser = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const fetchUserData = () => {
    const storedUser = localStorage.getItem('user')
    console.log('📂 [userStore] Načítavam používateľa z localStorage:', storedUser)

    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
        console.log('✅ [userStore] Úspešne načítané:', user.value)
      } catch (error) {
        console.error('❌ [userStore] Chyba pri parsovaní používateľa:', error)
        localStorage.removeItem('user') // ✅ Odstrániť pokazené dáta
      }
    }
  }

  watch(isLoggedIn, (newValue) => {
    console.log('🔄 Zmena stavu prihlásenia:', newValue)
  })

  return { user, token, isLoggedIn, isAdmin, setUser, fetchUserData, clearUser }
})
