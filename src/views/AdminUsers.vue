<template>
  <section class="admin-users">
    <h2>Správa užívateľov</h2>
    <button @click="showAddModal = true" class="action-button">Pridať užívateľa</button>

    <table class="admin-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Meno</th>
          <th>Email</th>
          <th>Adresa</th>
          <th>Rola</th>
          <th>Akcie</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.userEmail }}</td>
          <td>{{ user.userAddress }}</td>
          <td>{{ formatRoles(user.userRoles) }}</td>
          <td>
            <div class="action-buttons">
              <button @click="editUser(user)" class="action-button">Upraviť</button>
              <button @click="showDeleteModal(user)" class="action-button delete-button">
                Zmazať
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- MODÁLNE OKNO NA ÚPRAVU -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Upraviť používateľa</h3>
        <input v-model="editedUser.username" placeholder="Meno" />
        <input v-model="editedUser.userPassword" type="password" placeholder="Heslo" />
        <input v-model="editedUser.userEmail" placeholder="Email" />
        <input v-model="editedUser.userAddress" placeholder="Adresa" />

        <h4>Roly používateľa:</h4>
        <div v-for="role in editedUser.userRoles" :key="role" class="role-item">
          <span>{{ role }}</span>
          <button @click="removeRole(role)">➖</button>
        </div>

        <select v-model="newRole">
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button @click="addRole">➕ Pridať rolu</button>

        <button @click="saveEdit" class="action-button">Uložiť</button>
        <button @click="showEditModal = false" class="action-button delete-button">Zrušiť</button>
      </div>
    </div>

    <!-- MODÁLNE OKNO NA PRIDANIE -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>Pridať užívateľa</h3>
        <input v-model="newUser.username" placeholder="Meno" />
        <input v-model="newUser.userPassword" type="password" placeholder="Heslo" />
        <input v-model="newUser.userEmail" type="email" placeholder="Email" />
        <input v-model="newUser.userAddress" type="address" placeholder="Adresa" />
        <select v-model="newUser.userRoles">
          <option>USER</option>
          <option>ADMIN</option>
        </select>
        <button @click="addUser" class="action-button">Pridať</button>
        <button @click="showAddModal = false" class="action-button delete-button">Zrušiť</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { UserService } from '@/services/UserService'
import { User, UserRole } from '@/models/User'

const userService = new UserService()
const users = ref<User[]>([])
const showEditModal = ref(false)
const showAddModal = ref(false)
const editedUser = ref<User | null>(null)
const newUser = ref<User>({
  username: '',
  userEmail: '',
  userPassword: '',
  userRole: 'USER',
  userAddress: '',
  userRoles: ['USER'],
} as User)
const newRole = ref<string>('USER')

// ✅ Načítanie užívateľov zo servera
const fetchUsers = async () => {
  try {
    const response = await userService.getUsers()

    users.value = response.map((user) => ({
      ...user,
      userRoles: user.userRoles ? [...user.userRoles] : [], // ✅ Oprava
    }))

    console.log('✅ Používateľské roly načítané:', users.value)
  } catch (error) {
    console.error('❌ Chyba pri načítaní užívateľov:', error)
  }
}

const formatRoles = (roles: string[] | undefined) => {
  if (!roles || roles.length === 0) return 'Žiadne roly'
  return roles.join(', ') // ✅ Spojíme všetky roly správne
}

// ✅ ÚPRAVA UŽÍVATEĽA
const editUser = (user: User) => {
  editedUser.value = {
    ...user,
    userRoles: Array.isArray(user.userRoles) ? [...user.userRoles] : ['USER'], // ✅ Oprava
  }
  showEditModal.value = true
}

const saveEdit = async () => {
  if (!editedUser.value) return

  try {
    await userService.updateUser({
      ...editedUser.value,
      userRoles: [...editedUser.value.userRoles], // ✅ Posielame upravené roly
    })

    showEditModal.value = false
    fetchUsers()
  } catch (error) {
    console.error('❌ Chyba pri úprave užívateľa:', error)
    alert('Nepodarilo sa upraviť užívateľa.')
  }
}

// ✅ PRIDANIE UŽÍVATEĽA
const addUser = async () => {
  if (!newUser.value.username || !newUser.value.userEmail || !newUser.value.userPassword) {
    alert('Vyplňte všetky povinné polia!')
    return
  }

  const userData = {
    ...newUser.value,
    userRoles: Array.isArray(newUser.value.userRoles) ? newUser.value.userRoles : ['USER'],
  }

  try {
    await userService.addUser(userData)
    showAddModal.value = false
    fetchUsers()
    resetNewUser()
  } catch (error) {
    console.error('❌ Chyba pri pridávaní užívateľa:', error)
    alert('Nepodarilo sa pridať užívateľa.')
  }
}

// ✅ RESET FORMULÁRA PO PRIDANÍ
const resetNewUser = () => {
  newUser.value = {
    username: '',
    userEmail: '',
    userPassword: '',
    userAddress: '',
    userRoles: ['USER'],
  } as User
}

// ✅ ODSTRÁNENIE UŽÍVATEĽA
const showDeleteModal = (user: User) => {
  if (confirm(`Naozaj chcete odstrániť užívateľa ${user.username}?`) && user.id !== undefined) {
    deleteUser(user.id)
  }
}

const deleteUser = async (id: number) => {
  try {
    await userService.deleteUser(id)
    fetchUsers()
  } catch (error) {
    console.error('❌ Chyba pri odstraňovaní užívateľa:', error)
    alert('Nepodarilo sa odstrániť užívateľa.')
  }
}

const addRole = () => {
  if (!editedUser.value) return
  if (!editedUser.value.userRoles.includes(newRole.value)) {
    editedUser.value.userRoles.push(newRole.value) // ✅ Pridáme novú rolu
  }
}

const removeRole = (role: string) => {
  if (!editedUser.value) return
  editedUser.value.userRoles = editedUser.value.userRoles.filter((r) => r !== role) // ✅ Odstránime rolu
}

onMounted(fetchUsers)
</script>

<style scoped>
.admin-users {
  text-align: center;
  padding: 2rem;
}

/* ✅ Lepšia tabuľka */
.admin-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background: white;
  border-radius: 10px;
  overflow: hidden;
}

.admin-table th,
.admin-table td {
  border: 1px solid #ddd;
  padding: 1rem;
  text-align: center;
}

.admin-table th {
  background: #00bde7;
  color: white;
  text-transform: uppercase;
  font-weight: bold;
}

.admin-table tbody tr:hover {
  background: #f5f5f5;
}

/* ✅ Tlačidlá pre pridanie, úpravu a vymazanie */
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.action-button {
  background-color: #00bde7;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 8px;
  font-weight: bold;
  transition: 0.3s;
}

.action-button:hover {
  background-color: #007bbf;
}

.delete-button {
  background-color: #e81111;
}

.delete-button:hover {
  background-color: #c50b0b;
}

/* ✅ Štýl modálnych okien */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  width: 400px;
}

.modal-content input,
.modal-content textarea,
.modal-content select {
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
