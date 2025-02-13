import axios from 'axios'
import { User } from '../models/User'
import { useUserStore } from '@/stores/userStore'

const userUrl = 'http://localhost:8080/api/users/'

export class UserService {
  getAuthHeaders() {
    const store = useUserStore()
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: store.token ? `Bearer ${store.token}` : '',
      },
    }
  }

  async addUser(user: User): Promise<User> {
    const response = await axios.post(`${userUrl}add`, user, this.getAuthHeaders())
    return response.data
  }

  async updateUser(user: User): Promise<User> {
    const response = await axios.patch(`${userUrl}update/${user.id}`, user, this.getAuthHeaders())
    return response.data
  }

  async deleteUser(id: number): Promise<void> {
    await axios.delete(`${userUrl}delete/${id}`, this.getAuthHeaders())
  }

  async getUserById(id: number): Promise<User> {
    const response = await axios.get(`${userUrl}${id}`, this.getAuthHeaders())
    return response.data
  }

  async getUsers(): Promise<User[]> {
    const response = await axios.get(userUrl, this.getAuthHeaders())
    return response.data
  }

  async getUserByUsername(username: string): Promise<User> {
    const response = await axios.get(`${userUrl}user-name/${username}`, this.getAuthHeaders())
    return response.data
  }

  async loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await axios.post(`${userUrl}login`, { email, password }, this.getAuthHeaders())
    return response.data
  }

  async updatePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    if (!userId) throw new Error('User ID nesmie byť null.')
    await axios.patch(
      `${userUrl}update-password`,
      { userId, currentPassword, newPassword },
      this.getAuthHeaders(),
    )
  }
}
