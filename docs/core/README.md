# Entity Store Core

Le module `@malolebrin/entity-store-core` est le cœur agnostique de la bibliothèque Entity Store. Il fournit toutes les fonctionnalités de base pour gérer des entités relationnelles, indépendamment du gestionnaire d'état utilisé.

## 🎯 Objectifs

- **Agnostique** : Fonctionne avec n'importe quel gestionnaire d'état (Pinia, Zustand, Redux, etc.)
- **Performant** : Optimisé pour la gestion de grandes collections d'entités
- **Type-safe** : Support complet de TypeScript avec types génériques
- **Extensible** : Hooks de validation et de cycle de vie personnalisables
- **Compatible** : API rétrocompatible avec les versions précédentes

## 📦 Installation

```bash
npm install @malolebrin/entity-store-core
# ou
pnpm add @malolebrin/entity-store-core
# ou
yarn add @malolebrin/entity-store-core
```

## 🚀 Utilisation rapide

```typescript
import { createEntityStore } from '@malolebrin/entity-store-core'

interface User {
  id: string
  name: string
  email: string
  age: number
}

// Créer un store d'entités
const userStore = createEntityStore<User>({
  validateEntity: (user) => user.email.includes('@'),
  onEntityCreated: (user) => console.log('User created:', user)
})

// Utiliser le store
userStore.actions.createOne({ id: '1', name: 'John', email: 'john@example.com', age: 30 })
const users = userStore.getters.getAll()
```

## 🏗️ Architecture

Le module core est divisé en trois couches principales :

### 1. **State Management** (`/state`)
- `createState()` - Création d'un état initial
- `addEntityToState()` - Ajout d'entité au state
- `removeEntityFromState()` - Suppression d'entité
- `updateEntityInState()` - Mise à jour d'entité
- `setEntityDirty()` - Gestion du flag de modification

### 2. **Actions** (`/actions`)
- `createOne()` / `createMany()` - Création d'entités
- `updateOne()` - Mise à jour d'entité
- `deleteOne()` - Suppression d'entité
- `setCurrent()` / `setActive()` - Gestion de la sélection
- `setIsDirty()` / `updateField()` - Gestion des modifications

### 3. **Getters** (`/getters`)
- `getOne()` / `getMany()` - Récupération d'entités
- `getAll()` / `getAllArray()` - Récupération de toutes les entités
- `getWhere()` / `getFirstWhere()` - Filtrage et recherche
- `getIsEmpty()` / `getMissingIds()` - Utilitaires

## 🔧 Configuration

### EntityStoreConfig

```typescript
interface EntityStoreConfig<T> {
  // Validation des entités
  validateEntity?: (entity: T) => boolean
  
  // Hooks de cycle de vie
  onEntityCreated?: (entity: T) => void
  onEntityUpdated?: (entity: T, previous: T) => void
  onEntityDeleted?: (entity: T) => void
}
```

### Exemple de configuration avancée

```typescript
const config: EntityStoreConfig<User> = {
  validateEntity: (user) => {
    if (!user.email.includes('@')) return false
    if (user.age < 0 || user.age > 150) return false
    return true
  },
  
  onEntityCreated: (user) => {
    analytics.track('user_created', { userId: user.id })
  },
  
  onEntityUpdated: (user, previous) => {
    analytics.track('user_updated', { 
      userId: user.id, 
      changes: diff(previous, user) 
    })
  },
  
  onEntityDeleted: (user) => {
    analytics.track('user_deleted', { userId: user.id })
  }
}
```

## 📚 API Reference

### Types principaux

- `WithId` - Interface de base pour toutes les entités
- `Id` - Type union pour les identifiants (string | number)
- `State<T>` - Structure de l'état du store
- `EntityStore<T>` - Interface complète du store
- `EntityStoreConfig<T>` - Configuration du store

### Fonctions principales

- `createEntityStore<T>(config?)` - Factory principal
- `createState<T>()` - Création d'état
- `createActions<T>(state, config?)` - Création d'actions
- `createGetters<T>(state)` - Création de getters

## 🔄 Migration depuis la version précédente

Si vous utilisez déjà la version Pinia, la migration est simple :

```typescript
// Avant (version Pinia)
import { createState, createActions, createGetters } from '@malolebrin/pinia-entity-store'

// Après (version core)
import { createState, createActions, createGetters } from '@malolebrin/entity-store-core'
```

L'API reste identique, seule l'import change.

## 🧪 Tests

Le module core est entièrement testé avec une couverture de 100% :

```bash
# Tests du core uniquement
pnpm test:core

# Tous les tests
pnpm test
```

## 📖 Exemples

Consultez le dossier `/examples` pour des exemples d'utilisation complets :

- [Gestion d'utilisateurs](./examples/users.md)
- [Gestion de produits](./examples/products.md)
- [Gestion de commandes](./examples/orders.md)
- [Intégration avec différents state managers](./examples/integrations.md)

## 🤝 Contribution

Les contributions sont les bienvenues ! Consultez le guide de contribution pour plus de détails.

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.
