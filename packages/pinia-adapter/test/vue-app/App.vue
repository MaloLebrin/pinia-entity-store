<template>
  <div id="app">
    <h1>Pinia Entity Store Test</h1>
    
    <!-- Formulaire de création d'utilisateur -->
    <div class="form-section">
      <h2>Créer un utilisateur</h2>
      <input v-model="newUser.name" placeholder="Nom" />
      <input v-model="newUser.email" placeholder="Email" />
      <input v-model.number="newUser.age" type="number" placeholder="Âge" />
      <button @click="createUser" :disabled="!isValidUser">Créer</button>
    </div>

    <!-- Liste des utilisateurs -->
    <div class="users-section">
      <h2>Utilisateurs ({{ userStore.getAllIds().length }})</h2>
      <div v-if="userStore.getIsEmpty()" class="empty-state">
        Aucun utilisateur créé
      </div>
      <div v-else class="users-list">
        <div 
          v-for="userId in userStore.getAllIds()" 
          :key="userId"
          class="user-item"
          :class="{ 
            'current': userStore.getCurrent()?.id === userId,
            'active': userStore.getActive().includes(userId),
            'dirty': userStore.getOne()(userId)?.$isDirty
          }"
        >
          <div class="user-info">
            <strong>{{ userStore.getOne()(userId)?.name }}</strong>
            <span>{{ userStore.getOne()(userId)?.email }}</span>
            <span>Âge: {{ userStore.getOne()(userId)?.age }}</span>
            <span v-if="userStore.getOne()(userId)?.$isDirty" class="dirty-badge">Modifié</span>
          </div>
          <div class="user-actions">
            <button @click="setCurrent(userId)">Sélectionner</button>
            <button @click="setActive(userId)">Activer</button>
            <button @click="updateUser(userId)">Modifier</button>
            <button @click="deleteUser(userId)" class="delete">Supprimer</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions globales -->
    <div class="actions-section">
      <h2>Actions globales</h2>
      <button @click="resetStore">Réinitialiser le store</button>
      <button @click="createSampleUsers">Créer des utilisateurs de test</button>
      <button @click="toggleAllDirty">Basculer l'état modifié</button>
    </div>

    <!-- Statistiques -->
    <div class="stats-section">
      <h2>Statistiques</h2>
      <p>Total: {{ userStore.getAllIds().length }}</p>
      <p>Actifs: {{ userStore.getActive().length }}</p>
      <p>Modifiés: {{ getDirtyCount() }}</p>
      <p>Courant: {{ userStore.getCurrent()?.name || 'Aucun' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from './stores/userStore'

const userStore = useUserStore()

// État local pour le formulaire
const newUser = ref({
  name: '',
  email: '',
  age: 25
})

// Validation de l'utilisateur
const isValidUser = computed(() => {
  return newUser.value.name.trim() && 
         newUser.value.email.includes('@') && 
         newUser.value.age > 0
})

// Actions
const createUser = () => {
  if (isValidUser.value) {
    userStore.createOne({
      id: `user-${Date.now()}`,
      name: newUser.value.name,
      email: newUser.value.email,
      age: newUser.value.age,
      isActive: true
    })
    
    // Réinitialiser le formulaire
    newUser.value = { name: '', email: '', age: 25 }
  }
}

const setCurrent = (userId: string) => {
  const user = userStore.getOne()(userId)
  if (user) {
    userStore.setCurrent(user)
  }
}

const setActive = (userId: string) => {
  userStore.setActive(userId)
}

const updateUser = (userId: string) => {
  const user = userStore.getOne()(userId)
  if (user) {
    userStore.updateOne(userId, {
      ...user,
      age: user.age + 1
    })
  }
}

const deleteUser = (userId: string) => {
  userStore.deleteOne(userId)
}

const resetStore = () => {
  userStore.resetState()
}

const createSampleUsers = () => {
  const sampleUsers = [
    { id: 'user1', name: 'John Doe', email: 'john@example.com', age: 30, isActive: true },
    { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', age: 25, isActive: true },
    { id: 'user3', name: 'Bob Johnson', email: 'bob@example.com', age: 35, isActive: false }
  ]
  
  userStore.createMany(sampleUsers)
}

const toggleAllDirty = () => {
  userStore.getAllIds().forEach(userId => {
    const user = userStore.getOne()(userId)
    if (user) {
      userStore.setIsDirty(userId, !user.$isDirty)
    }
  })
}

const getDirtyCount = () => {
  return userStore.getAllIds().filter(userId => {
    const user = userStore.getOne()(userId)
    return user?.$isDirty
  }).length
}
</script>

<style scoped>
#app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.form-section, .users-section, .actions-section, .stats-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-section input {
  margin-right: 10px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-section button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-section button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.users-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-item {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background-color: #f9f9f9;
}

.user-item.current {
  border-color: #007bff;
  background-color: #e3f2fd;
}

.user-item.active {
  border-color: #28a745;
  background-color: #d4edda;
}

.user-item.dirty {
  border-color: #ffc107;
  background-color: #fff3cd;
}

.user-info {
  margin-bottom: 10px;
}

.user-info span {
  margin-right: 15px;
  color: #666;
}

.dirty-badge {
  background-color: #ffc107;
  color: #856404;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 12px;
}

.user-actions {
  display: flex;
  gap: 5px;
}

.user-actions button {
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 12px;
}

.user-actions button:not(.delete) {
  background-color: #6c757d;
  color: white;
}

.user-actions button.delete {
  background-color: #dc3545;
  color: white;
}

.actions-section button {
  margin-right: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #6c757d;
  color: white;
}

.stats-section p {
  margin: 5px 0;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
}
</style>
