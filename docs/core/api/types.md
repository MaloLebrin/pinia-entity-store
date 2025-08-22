# Types - Entity Store Core

Documentation complète des types et interfaces du module core.

## 📋 Vue d'ensemble

Le module core définit un ensemble de types TypeScript qui forment la base du système de gestion d'entités.

## 🔧 Types de base

### WithId

Interface de base pour toutes les entités gérées par le store.

```typescript
interface WithId {
  id: Id
}
```

**Propriétés :**
- `id` : Identifiant unique de l'entité

**Exemple d'utilisation :**
```typescript
interface User extends WithId {
  name: string
  email: string
  age: number
}

interface Product extends WithId {
  name: string
  price: number
  category: string
}
```

### Id

Type union pour les identifiants d'entités.

```typescript
type Id = string | number
```

**Utilisation :**
```typescript
// ✅ Valide
const stringId: Id = 'user-123'
const numberId: Id = 456

// ❌ Invalide
const invalidId: Id = true
const invalidId2: Id = null
```

## 🏗️ Types de structure

### State

Structure principale de l'état d'un store d'entités.

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

**Propriétés détaillées :**

- **`byId`** : Dictionnaire des entités indexées par leur ID
  - Clé : `Id` (string | number)
  - Valeur : Entité avec flag `$isDirty`
- **`allIds`** : Liste ordonnée de tous les IDs
- **`current`** : Entité actuellement sélectionnée (peut être null)
- **`currentById`** : Entité sélectionnée par ID (peut être null)
- **`active`** : Liste des IDs des entités actives

**Exemple d'état :**
```typescript
const userState: State<User> = {
  entities: {
    byId: {
      '1': { id: '1', name: 'John', email: 'john@example.com', $isDirty: false },
      '2': { id: '2', name: 'Jane', email: 'jane@example.com', $isDirty: true }
    },
    allIds: ['1', '2'],
    current: { id: '1', name: 'John', email: 'john@example.com', $isDirty: false },
    currentById: null,
    active: ['1']
  }
}
```

### EntityStoreConfig

Configuration d'un store d'entités avec hooks et validation.

```typescript
interface EntityStoreConfig<T> {
  validateEntity?: (entity: T) => boolean
  onEntityCreated?: (entity: T) => void
  onEntityUpdated?: (entity: T, previous: T) => void
  onEntityDeleted?: (entity: T) => void
}
```

**Propriétés :**

- **`validateEntity?`** : Fonction de validation optionnelle
  - Retourne `true` si l'entité est valide
  - Retourne `false` si l'entité est invalide
  - Si invalide, une erreur est levée
- **`onEntityCreated?`** : Hook appelé après création d'une entité
- **`onEntityUpdated?`** : Hook appelé après mise à jour d'une entité
- **`onEntityDeleted?`** : Hook appelé après suppression d'une entité

**Exemple de configuration :**
```typescript
const config: EntityStoreConfig<User> = {
  validateEntity: (user) => {
    if (!user.email.includes('@')) return false
    if (user.age < 0 || user.age > 150) return false
    return true
  },
  
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

## 🎯 Types d'actions

### EntityStore

Interface complète d'un store d'entités.

```typescript
interface EntityStore<T> {
  // État
  state: State<T & { $isDirty: boolean }>
  
  // Actions
  actions: {
    createOne: (entity: T) => void
    createMany: (entities: T[]) => void
    updateOne: (id: Id, updates: Partial<T>) => void
    deleteOne: (id: Id) => void
    setCurrent: (entity: T) => void
    setActive: (id: Id) => void
    setIsDirty: (id: Id, isDirty?: boolean) => void
    updateField: <K extends keyof T>(field: K, value: T[K], id: Id) => void
  }
  
  // Getters
  getters: {
    getOne: () => (id: Id) => (T & { $isDirty: boolean }) | undefined
    getMany: () => (ids: Id[]) => (T & { $isDirty: boolean })[]
    getAll: () => Record<Id, T & { $isDirty: boolean }>
    getAllArray: () => (T & { $isDirty: boolean })[]
    getAllIds: () => Id[]
    getWhere: () => (filter: (entity: T & { $isDirty: boolean }) => boolean) => Record<Id, T & { $isDirty: boolean }>
    getWhereArray: () => (filter: (entity: T & { $isDirty: boolean }) => boolean) => (T & { $isDirty: boolean })[]
    getFirstWhere: () => (filter: (entity: T & { $isDirty: boolean }) => boolean) => (T & { $isDirty: boolean }) | undefined
    getIsEmpty: () => boolean
    getIsNotEmpty: () => boolean
    getMissingIds: () => (ids: Id[]) => Id[]
    getMissingEntities: () => (entities: T[]) => T[]
    getCurrent: () => (T & { $isDirty: boolean }) | null
    getActive: () => Id[]
    getFirstActive: () => Id | undefined
  }
}
```

## 🔄 Types utilitaires

### ByIdParams

Paramètres pour les opérations basées sur l'ID.

```typescript
interface ByIdParams {
  id: Id
}
```

### FilterFn

Fonction de filtrage pour les getters.

```typescript
type FilterFn<T> = (entity: T) => boolean
```

**Exemple :**
```typescript
const isActive: FilterFn<User> = (user) => user.isActive
const isAdult: FilterFn<User> = (user) => user.age >= 18
const hasValidEmail: FilterFn<User> = (user) => user.email.includes('@')
```

### OptionalFilterFn

Fonction de filtrage optionnelle.

```typescript
type OptionalFilterFn<T> = FilterFn<T> | undefined
```

## 📝 Exemples d'utilisation

### Définition d'entités personnalisées

```typescript
// Entité de base
interface BaseEntity extends WithId {
  createdAt: Date
  updatedAt: Date
}

// Utilisateur
interface User extends BaseEntity {
  name: string
  email: string
  age: number
  isActive: boolean
  role: 'admin' | 'user' | 'moderator'
}

// Produit
interface Product extends BaseEntity {
  name: string
  price: number
  category: string
  inStock: boolean
  tags: string[]
}

// Commande
interface Order extends BaseEntity {
  userId: string
  productIds: string[]
  total: number
  status: 'pending' | 'completed' | 'cancelled'
}
```

### Configuration de store typée

```typescript
// Configuration pour les utilisateurs
const userStoreConfig: EntityStoreConfig<User> = {
  validateEntity: (user) => {
    if (!user.email.includes('@')) return false
    if (user.age < 0 || user.age > 150) return false
    if (!['admin', 'user', 'moderator'].includes(user.role)) return false
    return true
  },
  
  onEntityCreated: (user) => {
    console.log('User created:', user.name, 'with role:', user.role)
  }
}

// Configuration pour les produits
const productStoreConfig: EntityStoreConfig<Product> = {
  validateEntity: (product) => {
    if (product.price < 0) return false
    if (product.tags.length === 0) return false
    return true
  }
}
```

### Utilisation avec génériques

```typescript
// Store d'utilisateurs
const userStore = createEntityStore<User>(userStoreConfig)

// Store de produits
const productStore = createEntityStore<Product>(productStoreConfig)

// Store de commandes
const orderStore = createEntityStore<Order>()
```

## 🔍 Vérification des types

### Vérification de compatibilité

```typescript
// ✅ Compatible
const user: User = { id: '1', name: 'John', email: 'john@example.com', age: 30, isActive: true, role: 'user', createdAt: new Date(), updatedAt: new Date() }

// ❌ Incompatible - manque des propriétés
const invalidUser: User = { id: '1', name: 'John' }

// ❌ Incompatible - type d'ID incorrect
const invalidUser2: User = { id: true, name: 'John', email: 'john@example.com', age: 30, isActive: true, role: 'user', createdAt: new Date(), updatedAt: new Date() }
```

### Vérification de l'état

```typescript
// ✅ État valide
const validState: State<User> = {
  entities: {
    byId: {},
    allIds: [],
    current: null,
    currentById: null,
    active: []
  }
}

// ❌ État invalide - propriétés manquantes
const invalidState: State<User> = {
  entities: {
    byId: {}
    // allIds, current, currentById, active manquants
  }
}
```

## 📚 Références

- [API Reference](./README.md)
- [State Management](./state.md)
- [Actions](./actions.md)
- [Getters](./getters.md)
- [Factory Functions](./factory.md)
