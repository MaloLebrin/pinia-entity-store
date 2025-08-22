<div align="center" style="display:flex">
  <h1 style="margin-right: 2rem">Pinia-Entity-Store </h1>
  <a href="https://pinia.vuejs.org" target="_blank" rel="noopener noreferrer">
    <img width="50" src="https://pinia.vuejs.org/logo.svg" alt="Pinia logo">
  </a>
</div>
<br/>

[![Node.js Package](https://github.com/MaloLebrin/pinia-entity-store/actions/workflows/npm-publish-github-packages.yml/badge.svg)](https://github.com/MaloLebrin/pinia-entity-store/actions/workflows/npm-publish-github-packages.yml)

# Entity Store

A lightweight, agnostic entity store for managing relational entities with support for multiple state managers.

## 🏗️ Architecture

This project is organized as a monorepo with the following packages:

- **`@malolebrin/entity-store-core`** - The agnostic core that provides entity management logic
- **`@malolebrin/entity-store-pinia`** - Pinia adapter for Vue.js applications
- **`@malolebrin/entity-store-zustand`** - Zustand adapter for React applications

## 📦 Packages

### Core Package (`@malolebrin/entity-store-core`)

The core package provides the foundation for entity management:

- **State Management**: Normalized entity storage with `byId` and `allIds` patterns
- **Actions**: CRUD operations, entity lifecycle hooks, and validation
- **Getters**: Query methods, filtering, and computed properties
- **Configuration**: Custom validation, lifecycle hooks, and extensibility options

### Pinia Adapter (`@malolebrin/entity-store-pinia`)

```typescript
import { createPiniaEntityStore } from '@malolebrin/entity-store-pinia'

export const useUserStore = defineStore('user', {
  ...createPiniaEntityStore<UserEntity>({
    validateEntity: (user) => user.name.length > 0,
    onEntityCreated: (user) => console.log('User created:', user)
  })
})
```

### Zustand Adapter (`@malolebrin/entity-store-zustand`)

```typescript
import { createZustandEntityStore } from '@malolebrin/entity-store-zustand'
import { create } from 'zustand'

const useUserStore = create(
  createZustandEntityStore<UserEntity>({
    validateEntity: (user) => user.name.length > 0,
    onEntityCreated: (user) => console.log('User created:', user)
  })
)
```

## 🚀 Getting Started

### Installation

```bash
# Core package
npm install @malolebrin/entity-store-core

# Pinia adapter
npm install @malolebrin/entity-store-pinia

# Zustand adapter
npm install @malolebrin/entity-store-zustand
```

### Basic Usage

```typescript
import { createEntityStore } from '@malolebrin/entity-store-core'

interface User {
  id: string
  name: string
  email: string
}

const userStore = createEntityStore<User>({
  validateEntity: (user) => user.name.length > 0 && user.email.includes('@'),
  onEntityCreated: (user) => console.log('User created:', user)
})

// Add users
userStore.createOne({ id: '1', name: 'John', email: 'john@example.com' })

// Query users
const user = userStore.getOne('1')
const allUsers = userStore.getAllArray()
```

## 🔧 Configuration

Each package supports configuration options:

### Core Configuration

```typescript
interface EntityStoreConfig<T> {
  validateEntity?: (entity: T) => boolean | string
  onEntityCreated?: (entity: T) => void
  onEntityUpdated?: (entity: T, previousEntity: T) => void
  onEntityDeleted?: (entity: T) => void
  customDirtyCheck?: (entity: T) => boolean
  generateId?: () => Id
}
```

### Adapter-Specific Configuration

Each adapter extends the core configuration with framework-specific options.

## 🧪 Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Build specific package
pnpm build:core
pnpm build:pinia
pnpm build:zustand

# Run tests
pnpm test

# Run tests for specific package
pnpm test:core
pnpm test:pinia
pnpm test:zustand
```

## 📚 Documentation

### Core Module
- [Core Overview](./docs/core/README.md)
- [API Reference](./docs/core/api/README.md)
- [Types](./docs/core/api/types.md)
- [Examples](./docs/core/examples/)

### Adapters
- [Pinia Adapter](./packages/pinia-adapter/README.md)
- [Zustand Adapter](./packages/zustand-adapter/README.md)

### Getting Started
- [Quick Start](./docs/getting-started/)
- [Contributing](./docs/contributing.md)

> **Note:** Documentation is provided as Markdown files for easy reading and contribution. Each package includes its own README with specific usage examples.

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines and ensure all tests pass before submitting a pull request.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.
