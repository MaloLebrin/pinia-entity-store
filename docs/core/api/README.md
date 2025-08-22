# API Reference - Entity Store Core

Documentation complète de l'API du module core.

## 📋 Table des matières

- [Types](./types.md)
- [State Management](./state.md)
- [Actions](./actions.md)
- [Getters](./getters.md)
- [Factory Functions](./factory.md)

## 🏗️ Vue d'ensemble de l'architecture

```
Entity Store Core
├── Types (interfaces et types TypeScript)
├── State (gestion de l'état)
├── Actions (modifications de l'état)
├── Getters (lecture de l'état)
└── Factory (création de stores)
```

## 🔧 Utilisation de base

### Import des modules

```typescript
// Import complet
import { createEntityStore } from '@malolebrin/entity-store-core'

// Import par module
import { createState, createActions, createGetters } from '@malolebrin/entity-store-core'

// Import des types
import type { WithId, State, EntityStoreConfig } from '@malolebrin/entity-store-core'
```

### Création d'un store

```typescript
interface User {
  id: string
  name: string
  email: string
}

// Création simple
const userStore = createEntityStore<User>()

// Création avec configuration
const userStore = createEntityStore<User>({
  validateEntity: (user) => user.email.includes('@'),
  onEntityCreated: (user) => console.log('Created:', user)
})
```

## 📊 Structure de l'état

L'état d'un store d'entités suit cette structure :

```typescript
interface State<T> {
  entities: {
    byId: Record<Id, T & { $isDirty: boolean }>
    allIds: Id[]
    current: (T & { $isDirty: boolean }) | null
    currentById: (T & { $isDirty: boolean }) | null
    active: Id[]
  }
}
```

### Propriétés de l'état

- **`byId`** : Dictionnaire des entités indexées par leur ID
- **`allIds`** : Liste ordonnée de tous les IDs
- **`current`** : Entité actuellement sélectionnée
- **`currentById`** : Entité sélectionnée par ID
- **`active`** : Liste des IDs des entités actives
- **`$isDirty`** : Flag indiquant si l'entité a été modifiée

## 🎯 Patterns d'utilisation

### 1. Gestion CRUD basique

```typescript
// Create
userStore.actions.createOne({ id: '1', name: 'John', email: 'john@example.com' })

// Read
const user = userStore.getters.getOne()('1')
const allUsers = userStore.getters.getAll()

// Update
userStore.actions.updateOne('1', { name: 'John Doe' })

// Delete
userStore.actions.deleteOne('1')
```

### 2. Gestion de la sélection

```typescript
// Définir l'entité courante
userStore.actions.setCurrent(user)

// Récupérer l'entité courante
const current = userStore.getters.getCurrent()

// Gérer les entités actives
userStore.actions.setActive('1')
userStore.actions.setActive('2')
const activeIds = userStore.getters.getActive()
```

### 3. Filtrage et recherche

```typescript
// Filtrer par condition
const activeUsers = userStore.getters.getWhere()(user => user.isActive)

// Rechercher la première entité correspondante
const firstActive = userStore.getters.getFirstWhere()(user => user.isActive)

// Obtenir les entités manquantes
const missingIds = userStore.getters.getMissingIds()(['1', '2', '3'])
```

## 🔄 Gestion des modifications

### Flag $isDirty

Chaque entité possède un flag `$isDirty` qui indique si elle a été modifiée :

```typescript
// Marquer comme modifiée
userStore.actions.setIsDirty('1')

// Mise à jour automatique lors des modifications
userStore.actions.updateField('name', 'New Name', '1')
// L'entité est automatiquement marquée comme $isDirty: true
```

### Validation des entités

```typescript
const config: EntityStoreConfig<User> = {
  validateEntity: (user) => {
    if (!user.email.includes('@')) return false
    if (user.age < 0) return false
    return true
  }
}

// Si la validation échoue, une erreur est levée
try {
  userStore.actions.createOne(invalidUser)
} catch (error) {
  console.error('Validation failed:', error.message)
}
```

## 🎣 Hooks de cycle de vie

### Configuration des hooks

```typescript
const config: EntityStoreConfig<User> = {
  onEntityCreated: (user) => {
    console.log('User created:', user)
    analytics.track('user_created', { userId: user.id })
  },
  
  onEntityUpdated: (user, previous) => {
    console.log('User updated:', user, 'Previous:', previous)
    analytics.track('user_updated', { userId: user.id })
  },
  
  onEntityDeleted: (user) => {
    console.log('User deleted:', user)
    analytics.track('user_deleted', { userId: user.id })
  }
}
```

### Ordre d'exécution

1. **Validation** : `validateEntity` est appelé en premier
2. **Modification** : L'état est modifié
3. **Hook** : Le hook approprié est appelé avec les données

## 🚀 Performance et optimisations

### Gestion de la mémoire

- Les entités sont stockées dans un dictionnaire pour un accès O(1)
- Les IDs sont maintenus dans un tableau pour l'ordre et l'itération
- Pas de duplication de données

### Optimisations recommandées

```typescript
// ✅ Bon : Utiliser getWhere pour le filtrage
const activeUsers = userStore.getters.getWhere()(user => user.isActive)

// ❌ Éviter : Filtrer manuellement
const allUsers = userStore.getters.getAllArray()
const activeUsers = allUsers.filter(user => user.isActive)
```

## 🔍 Débogage et monitoring

### Logs de développement

```typescript
const config: EntityStoreConfig<User> = {
  onEntityCreated: (user) => console.log('➕ Created:', user),
  onEntityUpdated: (user, previous) => console.log('✏️ Updated:', user, '←', previous),
  onEntityDeleted: (user) => console.log('🗑️ Deleted:', user)
}
```

### État du store

```typescript
// Vérifier l'état global
console.log('Store state:', userStore.state)

// Vérifier les entités
console.log('Entities count:', userStore.getters.getAllIds().length)
console.log('Is empty:', userStore.getters.getIsEmpty())
```

## 📚 Références croisées

- [Types détaillés](./types.md)
- [Gestion de l'état](./state.md)
- [Actions disponibles](./actions.md)
- [Getters et requêtes](./getters.md)
- [Factory et configuration](./factory.md)
