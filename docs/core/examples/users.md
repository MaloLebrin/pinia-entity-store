# Exemple : Gestion d'utilisateurs

Exemple complet d'utilisation du module core pour gérer des utilisateurs dans une application.

## 🎯 Scénario

Nous allons créer un système de gestion d'utilisateurs avec :
- Création, lecture, mise à jour et suppression d'utilisateurs
- Validation des données
- Gestion des rôles et permissions
- Suivi des modifications
- Analytics et logging

## 🏗️ Définition des types

```typescript
import type { WithId } from '@malolebrin/entity-store-core'

// Types d'énumération
type UserRole = 'admin' | 'moderator' | 'user' | 'guest'
type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending'

// Interface de base pour les utilisateurs
interface User extends WithId {
  username: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  status: UserStatus
  age: number
  isVerified: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

// Types pour les mises à jour
type UserUpdate = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
type UserCreate = Omit<User, 'id' | 'createdAt' | 'updatedAt'>
```

## 🔧 Configuration du store

```typescript
import { createEntityStore } from '@malolebrin/entity-store-core'
import type { EntityStoreConfig } from '@malolebrin/entity-store-core'

// Configuration de validation
const userValidation = (user: UserCreate): boolean => {
  // Validation de l'email
  if (!user.email.includes('@') || !user.email.includes('.')) {
    return false
  }
  
  // Validation de l'âge
  if (user.age < 13 || user.age > 120) {
    return false
  }
  
  // Validation du nom d'utilisateur
  if (user.username.length < 3 || user.username.length > 20) {
    return false
  }
  
  // Validation du nom
  if (user.firstName.length < 1 || user.lastName.length < 1) {
    return false
  }
  
  return true
}

// Configuration des hooks
const userHooks: EntityStoreConfig<User> = {
  validateEntity: userValidation,
  
  onEntityCreated: (user) => {
    console.log('👤 User created:', user.username)
    
    // Analytics
    analytics.track('user_created', {
      userId: user.id,
      role: user.role,
      age: user.age
    })
    
    // Notification d'équipe pour les admins
    if (user.role === 'admin') {
      notifyTeam(`New admin user: ${user.username}`)
    }
  },
  
  onEntityUpdated: (user, previous) => {
    console.log('✏️ User updated:', user.username)
    
    // Détecter les changements importants
    const changes = {
      roleChanged: previous.role !== user.role,
      statusChanged: previous.status !== user.status,
      emailChanged: previous.email !== user.email
    }
    
    // Analytics
    analytics.track('user_updated', {
      userId: user.id,
      changes,
      previousRole: previous.role,
      newRole: user.role
    })
    
    // Alerte pour les changements de rôle
    if (changes.roleChanged && user.role === 'admin') {
      securityAlert(`User ${user.username} promoted to admin`)
    }
  },
  
  onEntityDeleted: (user) => {
    console.log('🗑️ User deleted:', user.username)
    
    // Analytics
    analytics.track('user_deleted', {
      userId: user.id,
      role: user.role,
      lastStatus: user.status
    })
    
    // Audit trail
    auditLog('user_deleted', {
      deletedBy: getCurrentUser().id,
      deletedUser: user
    })
  }
}

// Création du store
const userStore = createEntityStore<User>(userHooks)
```

## 🚀 Utilisation du store

### Création d'utilisateurs

```typescript
// Créer un utilisateur
const createUser = (userData: UserCreate): User => {
  const now = new Date()
  const user: User = {
    ...userData,
    id: generateId(), // Fonction utilitaire pour générer un ID unique
    createdAt: now,
    updatedAt: now
  }
  
  try {
    userStore.actions.createOne(user)
    return user
  } catch (error) {
    console.error('Failed to create user:', error.message)
    throw error
  }
}

// Exemples d'utilisation
const john = createUser({
  username: 'john_doe',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'user',
  status: 'pending',
  age: 25,
  isVerified: false
})

const admin = createUser({
  username: 'admin_user',
  email: 'admin@example.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'admin',
  status: 'active',
  age: 30,
  isVerified: true
})
```

### Lecture et recherche

```typescript
// Récupérer un utilisateur par ID
const getUser = (id: string): User | undefined => {
  return userStore.getters.getOne()(id)
}

// Récupérer tous les utilisateurs
const getAllUsers = (): User[] => {
  return userStore.getters.getAllArray()
}

// Rechercher des utilisateurs
const searchUsers = {
  // Par rôle
  byRole: (role: UserRole): User[] => {
    return userStore.getters.getWhereArray()(user => user.role === role)
  },
  
  // Par statut
  byStatus: (status: UserStatus): User[] => {
    return userStore.getters.getWhereArray()(user => user.status === status)
  },
  
  // Utilisateurs actifs
  active: (): User[] => {
    return userStore.getters.getWhereArray()(user => user.status === 'active')
  },
  
  // Utilisateurs vérifiés
  verified: (): User[] => {
    return userStore.getters.getWhereArray()(user => user.isVerified)
  },
  
  // Par âge
  byAgeRange: (min: number, max: number): User[] => {
    return userStore.getters.getWhereArray()(user => user.age >= min && user.age <= max)
  },
  
  // Par nom ou email (recherche textuelle)
  byText: (query: string): User[] => {
    const lowerQuery = query.toLowerCase()
    return userStore.getters.getWhereArray()(user => 
      user.username.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery) ||
      user.firstName.toLowerCase().includes(lowerQuery) ||
      user.lastName.toLowerCase().includes(lowerQuery)
    )
  }
}
```

### Mise à jour des utilisateurs

```typescript
// Mettre à jour un utilisateur
const updateUser = (id: string, updates: UserUpdate): void => {
  try {
    userStore.actions.updateOne(id, updates)
    
    // Mettre à jour le timestamp
    userStore.actions.updateField('updatedAt', new Date(), id)
  } catch (error) {
    console.error('Failed to update user:', error.message)
    throw error
  }
}

// Exemples de mises à jour
const updateUserExamples = () => {
  // Promouvoir un utilisateur
  updateUser('user-123', { role: 'moderator' })
  
  // Activer un compte
  updateUser('user-456', { 
    status: 'active',
    isVerified: true 
  })
  
  // Mettre à jour les informations personnelles
  updateUser('user-789', {
    firstName: 'Jane',
    lastName: 'Smith',
    age: 26
  })
  
  // Marquer la dernière connexion
  updateUser('user-123', { lastLoginAt: new Date() })
}
```

### Gestion de la sélection

```typescript
// Gestion de l'utilisateur courant
const userSelection = {
  // Définir l'utilisateur courant
  setCurrent: (user: User) => {
    userStore.actions.setCurrent(user)
  },
  
  // Récupérer l'utilisateur courant
  getCurrent: (): User | null => {
    return userStore.getters.getCurrent()
  },
  
  // Effacer la sélection
  clearCurrent: () => {
    userStore.actions.setCurrent(null as any)
  }
}

// Gestion des utilisateurs actifs (multi-sélection)
const userMultiSelection = {
  // Ajouter un utilisateur à la sélection
  addToSelection: (userId: string) => {
    userStore.actions.setActive(userId)
  },
  
  // Retirer un utilisateur de la sélection
  removeFromSelection: (userId: string) => {
    // Note: Cette fonctionnalité nécessiterait une extension du store
    // pour l'instant, on utilise une approche alternative
  },
  
  // Récupérer tous les utilisateurs sélectionnés
  getSelected: (): User[] => {
    const selectedIds = userStore.getters.getActive()
    return userStore.getters.getMany()(selectedIds)
  },
  
  // Effacer la sélection
  clearSelection: () => {
    // Note: Cette fonctionnalité nécessiterait une extension du store
  }
}
```

### Suppression d'utilisateurs

```typescript
// Supprimer un utilisateur
const deleteUser = (id: string): void => {
  try {
    userStore.actions.deleteOne(id)
    console.log('User deleted successfully')
  } catch (error) {
    console.error('Failed to delete user:', error.message)
    throw error
  }
}

// Supprimer plusieurs utilisateurs
const deleteMultipleUsers = (ids: string[]): void => {
  ids.forEach(id => {
    try {
      deleteUser(id)
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error.message)
    }
  })
}

// Supprimer les utilisateurs inactifs
const deleteInactiveUsers = (): void => {
  const inactiveUsers = searchUsers.byStatus('inactive')
  const inactiveIds = inactiveUsers.map(user => user.id)
  
  console.log(`Deleting ${inactiveIds.length} inactive users`)
  deleteMultipleUsers(inactiveIds)
}
```

## 📊 Utilitaires et helpers

```typescript
// Statistiques des utilisateurs
const getUserStats = () => {
  const allUsers = getAllUsers()
  
  return {
    total: allUsers.length,
    byRole: {
      admin: allUsers.filter(u => u.role === 'admin').length,
      moderator: allUsers.filter(u => u.role === 'moderator').length,
      user: allUsers.filter(u => u.role === 'user').length,
      guest: allUsers.filter(u => u.role === 'guest').length
    },
    byStatus: {
      active: allUsers.filter(u => u.status === 'active').length,
      inactive: allUsers.filter(u => u.status === 'inactive').length,
      suspended: allUsers.filter(u => u.status === 'suspended').length,
      pending: allUsers.filter(u => u.status === 'pending').length
    },
    verified: allUsers.filter(u => u.isVerified).length,
    averageAge: allUsers.reduce((sum, u) => sum + u.age, 0) / allUsers.length
  }
}

// Validation avancée
const validateUserData = (userData: Partial<UserCreate>): string[] => {
  const errors: string[] = []
  
  if (userData.email && !userData.email.includes('@')) {
    errors.push('Invalid email format')
  }
  
  if (userData.age && (userData.age < 13 || userData.age > 120)) {
    errors.push('Age must be between 13 and 120')
  }
  
  if (userData.username && (userData.username.length < 3 || userData.username.length > 20)) {
    errors.push('Username must be between 3 and 20 characters')
  }
  
  return errors
}

// Export des données
const exportUsers = (): string => {
  const users = getAllUsers()
  return JSON.stringify(users, null, 2)
}
```

## 🔍 Monitoring et débogage

```typescript
// Logs de développement
const enableDebugLogs = () => {
  console.log('🔍 User Store Debug Mode Enabled')
  console.log('Current state:', userStore.state)
  console.log('Total users:', userStore.getters.getAllIds().length)
  console.log('Is empty:', userStore.getters.getIsEmpty())
}

// Vérification de l'intégrité des données
const validateStoreIntegrity = (): boolean => {
  const allIds = userStore.getters.getAllIds()
  const byId = userStore.getters.getAll()
  
  // Vérifier que tous les IDs dans allIds existent dans byId
  const missingInById = allIds.filter(id => !byId[id])
  
  // Vérifier que tous les IDs dans byId existent dans allIds
  const missingInAllIds = Object.keys(byId).filter(id => !allIds.includes(id))
  
  if (missingInById.length > 0 || missingInAllIds.length > 0) {
    console.error('Store integrity check failed:', {
      missingInById,
      missingInAllIds
    })
    return false
  }
  
  console.log('✅ Store integrity check passed')
  return true
}

// Performance monitoring
const measurePerformance = () => {
  const start = performance.now()
  
  // Test de performance : récupérer tous les utilisateurs
  const users = getAllUsers()
  
  const end = performance.now()
  console.log(`Performance: getAllUsers took ${end - start}ms for ${users.length} users`)
}
```

## 🎯 Cas d'usage avancés

### Gestion des permissions

```typescript
// Vérifier les permissions d'un utilisateur
const checkUserPermissions = (userId: string, action: string): boolean => {
  const user = getUser(userId)
  if (!user) return false
  
  const permissions = {
    'read_users': ['admin', 'moderator'],
    'write_users': ['admin'],
    'delete_users': ['admin'],
    'manage_roles': ['admin']
  }
  
  return permissions[action]?.includes(user.role) || false
}

// Utilisation
if (checkUserPermissions(currentUserId, 'write_users')) {
  updateUser('user-123', { role: 'moderator' })
} else {
  throw new Error('Insufficient permissions')
}
```

### Synchronisation avec une API

```typescript
// Synchroniser avec une API externe
const syncWithAPI = async () => {
  try {
    // Récupérer les utilisateurs depuis l'API
    const apiUsers = await fetchUsersFromAPI()
    
    // Mettre à jour le store local
    apiUsers.forEach(apiUser => {
      const localUser = getUser(apiUser.id)
      
      if (localUser) {
        // Mettre à jour l'utilisateur existant
        updateUser(apiUser.id, apiUser)
      } else {
        // Créer un nouvel utilisateur
        createUser(apiUser)
      }
    })
    
    console.log('Sync completed successfully')
  } catch (error) {
    console.error('Sync failed:', error)
  }
}
```

## 📚 Résumé

Cet exemple démontre comment utiliser le module core pour :

1. **Définir des types robustes** avec TypeScript
2. **Configurer la validation** et les hooks de cycle de vie
3. **Implémenter des opérations CRUD** complètes
4. **Gérer la sélection** et la multi-sélection
5. **Rechercher et filtrer** les données efficacement
6. **Surveiller les performances** et l'intégrité des données
7. **Intégrer avec des systèmes externes** (API, analytics, etc.)

Le module core fournit une base solide et flexible pour construire des systèmes de gestion d'entités complexes tout en maintenant la simplicité d'utilisation.
