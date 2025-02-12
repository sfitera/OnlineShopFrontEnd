import { defineStore } from 'pinia'
import { ref } from 'vue'
import { User } from '@/models/User'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = ref<boolean>(false)

  const setUser = (userData: User) => {
    user.value = userData
    isLoggedIn.value = true
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const clearUser = () => {
    user.value = null
    isLoggedIn.value = false
    localStorage.removeItem('user')
  }

  const loadUserFromStorage = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
      isLoggedIn.value = true
    }
  }

  return { user, isLoggedIn, setUser, clearUser, loadUserFromStorage }
})
