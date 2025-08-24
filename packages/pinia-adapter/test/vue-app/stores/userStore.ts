import { defineStore } from 'pinia'
import type { User } from '../../../core/test/fixtures/entities'
import { createPiniaEntityStore } from '../../index.ts'

// Configuration du store avec validation et hooks
const storeConfig = {
  storeName: 'user-store',
  validateEntity: (user: User) => {
    // Validation personnalisée
    if (!user.name || user.name.trim().length === 0) {
      return 'Le nom est requis'
    }
    if (!user.email || !user.email.includes('@')) {
      return 'Email invalide'
    }
    if (user.age < 0 || user.age > 150) {
      return 'Âge invalide'
    }
    return true
  },
  onEntityCreated: (user: User) => {
    console.log('Utilisateur créé:', user)
  },
  onEntityUpdated: (user: User, previous: User) => {
    console.log('Utilisateur mis à jour:', { previous, current: user })
  },
  onEntityDeleted: (user: User) => {
    console.log('Utilisateur supprimé:', user)
  }
}

// Création du store avec notre adaptateur
export const useUserStore = defineStore(
  createPiniaEntityStore<User>(storeConfig)
)
