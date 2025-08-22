import { describe, test, expect, beforeEach, vi } from 'vitest'
import { createUser, createProduct, mockUsers, mockProducts } from '../fixtures/entities'

// Import des vraies fonctions du core (sans mocks cette fois)
// Note: En attendant que les vrais modules soient disponibles, on utilise des implémentations simplifiées

interface CoreState<T> {
  entities: {
    byId: Record<string | number, T & { $isDirty: boolean }>
    allIds: (string | number)[]
    current: (T & { $isDirty: boolean }) | null
    currentById: (T & { $isDirty: boolean }) | null
    active: (string | number)[]
  }
}

interface CoreConfig<T> {
  validateEntity?: (entity: T) => boolean
  onEntityCreated?: (entity: T) => void
  onEntityUpdated?: (entity: T, previous: T) => void
  onEntityDeleted?: (entity: T) => void
}

// Implémentation réelle simplifiée du core pour les tests d'intégration
function createRealState<T>(): CoreState<T> {
  return {
    entities: {
      byId: {},
      allIds: [],
      current: null,
      currentById: null,
      active: []
    }
  }
}

function createRealActions<T>(state: CoreState<T>, config?: CoreConfig<T>) {
  return {
    createOne: (entity: T & { id: string | number }) => {
      // Validation
      if (config?.validateEntity && !config.validateEntity(entity)) {
        throw new Error(`Entity validation failed for entity with id: ${entity.id}`)
      }

      // Ajouter l'entité seulement si elle n'existe pas déjà
      if (!state.entities.byId[entity.id]) {
        const entityWithDirty = { ...entity, $isDirty: false }
        state.entities.byId[entity.id] = entityWithDirty
        state.entities.allIds.push(entity.id)
      }

      // Hook
      if (config?.onEntityCreated) {
        config.onEntityCreated(entity)
      }
    },

    createMany: (entities: (T & { id: string | number })[]) => {
      entities.forEach(entity => {
        // Validation
        if (config?.validateEntity && !config.validateEntity(entity)) {
          throw new Error(`Entity validation failed for entity with id: ${entity.id}`)
        }

        // Ajouter l'entité seulement si elle n'existe pas déjà
        if (!state.entities.byId[entity.id]) {
          const entityWithDirty = { ...entity, $isDirty: false }
          state.entities.byId[entity.id] = entityWithDirty
          state.entities.allIds.push(entity.id)
        }

        // Hook
        if (config?.onEntityCreated) {
          config.onEntityCreated(entity)
        }
      })
    },

    updateOne: (id: string | number, updates: Partial<T>) => {
      if (state.entities.byId[id]) {
        const previous = { ...state.entities.byId[id] }
        const updated = { ...state.entities.byId[id], ...updates, $isDirty: true }
        state.entities.byId[id] = updated

        // Hook
        if (config?.onEntityUpdated) {
          config.onEntityUpdated(updated, previous)
        }
      }
    },

    deleteOne: (id: string | number) => {
      if (state.entities.byId[id]) {
        const entity = { ...state.entities.byId[id] }
        delete state.entities.byId[id]
        state.entities.allIds = state.entities.allIds.filter(entityId => entityId !== id)
        
        // Nettoyer les références
        if (state.entities.current?.id === id) {
          state.entities.current = null
        }
        if (state.entities.currentById?.id === id) {
          state.entities.currentById = null
        }
        state.entities.active = state.entities.active.filter(activeId => activeId !== id)

        // Hook
        if (config?.onEntityDeleted) {
          config.onEntityDeleted(entity)
        }
      }
    },

    setCurrent: (entity: (T & { id: string | number }) | null) => {
      state.entities.current = entity ? { ...entity, $isDirty: false } : null
    },

    setActive: (id: string | number) => {
      if (!state.entities.active.includes(id)) {
        state.entities.active.push(id)
      }
    },

    removeActive: (id: string | number) => {
      state.entities.active = state.entities.active.filter(activeId => activeId !== id)
    },

    clearActive: () => {
      state.entities.active = []
    },

    setIsDirty: (id: string | number, isDirty: boolean = true) => {
      if (state.entities.byId[id]) {
        state.entities.byId[id].$isDirty = isDirty
      }
    },

    updateField: <K extends keyof T>(field: K, value: T[K], id: string | number) => {
      if (state.entities.byId[id]) {
        (state.entities.byId[id] as any)[field] = value
        state.entities.byId[id].$isDirty = true
      }
    },

    resetState: () => {
      const newState = createRealState<T>()
      Object.assign(state, newState)
    }
  }
}

function createRealGetters<T>(state: CoreState<T>) {
  return {
    getOne: (id: string | number) => state.entities.byId[id],
    
    getMany: (ids: (string | number)[]) => 
      ids.map(id => state.entities.byId[id]).filter(Boolean),
    
    getAll: () => state.entities.byId,
    
    getAllArray: () => Object.values(state.entities.byId),
    
    getAllIds: () => [...state.entities.allIds],
    
    getWhere: (filter: (entity: T & { $isDirty: boolean }) => boolean) => {
      const result: Record<string | number, T & { $isDirty: boolean }> = {}
      Object.entries(state.entities.byId).forEach(([id, entity]) => {
        if (filter(entity)) {
          result[id] = entity
        }
      })
      return result
    },
    
    getWhereArray: (filter: (entity: T & { $isDirty: boolean }) => boolean) =>
      Object.values(state.entities.byId).filter(filter),
    
    getFirstWhere: (filter: (entity: T & { $isDirty: boolean }) => boolean) =>
      Object.values(state.entities.byId).find(filter),
    
    getIsEmpty: () => state.entities.allIds.length === 0,
    
    getIsNotEmpty: () => state.entities.allIds.length > 0,
    
    getCount: () => state.entities.allIds.length,
    
    getMissingIds: (ids: (string | number)[]) =>
      ids.filter(id => !state.entities.byId[id]),
    
    getMissingEntities: (entities: (T & { id: string | number })[]) =>
      entities.filter(entity => !state.entities.byId[entity.id]),
    
    getCurrent: () => state.entities.current,
    
    getActive: () => [...state.entities.active],
    
    getFirstActive: () => state.entities.active[0],
    
    getDirtyEntities: () => 
      Object.values(state.entities.byId).filter(entity => entity.$isDirty),
    
    getCleanEntities: () => 
      Object.values(state.entities.byId).filter(entity => !entity.$isDirty)
  }
}

function createRealEntityStore<T>(config?: CoreConfig<T>) {
  const state = createRealState<T>()
  const actions = createRealActions(state, config)
  const getters = createRealGetters(state)

  return {
    state,
    actions,
    getters
  }
}

describe('Core Integration Tests - Real Implementation', () => {
  describe('Basic CRUD Operations', () => {
    test('should perform complete CRUD lifecycle', () => {
      const store = createRealEntityStore<typeof mockUsers[0]>()
      const user = createUser()

      // Create
      store.actions.createOne(user)
      expect(store.getters.getCount()).toBe(1)
      expect(store.getters.getOne(user.id)).toEqual({ ...user, $isDirty: false })

      // Read
      const retrievedUser = store.getters.getOne(user.id)
      expect(retrievedUser).toBeDefined()
      expect(retrievedUser?.name).toBe(user.name)

      // Update
      store.actions.updateOne(user.id, { name: 'Updated Name' })
      const updatedUser = store.getters.getOne(user.id)
      expect(updatedUser?.name).toBe('Updated Name')
      expect(updatedUser?.$isDirty).toBe(true)

      // Delete
      store.actions.deleteOne(user.id)
      expect(store.getters.getOne(user.id)).toBeUndefined()
      expect(store.getters.getCount()).toBe(0)
    })

    test('should handle batch operations correctly', () => {
      const store = createRealEntityStore<typeof mockUsers[0]>()
      const users = mockUsers.slice(0, 3)

      // Batch create
      store.actions.createMany(users)
      expect(store.getters.getCount()).toBe(3)
      expect(store.getters.getAllIds()).toHaveLength(3)

      // Verify all entities exist
      users.forEach(user => {
        const stored = store.getters.getOne(user.id)
        expect(stored).toBeDefined()
        expect(stored?.name).toBe(user.name)
      })

      // Batch update via individual updates
      users.forEach(user => {
        store.actions.updateOne(user.id, { age: user.age + 1 })
      })

      // Verify updates
      users.forEach(user => {
        const updated = store.getters.getOne(user.id)
        expect(updated?.age).toBe(user.age + 1)
        expect(updated?.$isDirty).toBe(true)
      })
    })
  })

  describe('State Management', () => {
    test('should manage current entity correctly', () => {
      const store = createRealEntityStore<typeof mockUsers[0]>()
      const user1 = createUser({ id: 'user1', name: 'User 1' })
      const user2 = createUser({ id: 'user2', name: 'User 2' })

      store.actions.createOne(user1)
      store.actions.createOne(user2)

      // Set current
      store.actions.setCurrent(user1)
      expect(store.getters.getCurrent()?.id).toBe(user1.id)

      // Change current
      store.actions.setCurrent(user2)
      expect(store.getters.getCurrent()?.id).toBe(user2.id)

      // Clear current
      store.actions.setCurrent(null)
      expect(store.getters.getCurrent()).toBeNull()
    })

    test('should manage active entities correctly', () => {
      const store = createRealEntityStore<typeof mockUsers[0]>()
      const users = mockUsers.slice(0, 3)

      store.actions.createMany(users)

      // Set multiple active
      store.actions.setActive(users[0].id)
      store.actions.setActive(users[1].id)
      
      const active = store.getters.getActive()
      expect(active).toHaveLength(2)
      expect(active).toContain(users[0].id)
      expect(active).toContain(users[1].id)

      // Remove one active
      store.actions.removeActive(users[0].id)
      const activeAfterRemove = store.getters.getActive()
      expect(activeAfterRemove).toHaveLength(1)
      expect(activeAfterRemove).toContain(users[1].id)

      // Clear all active
      store.actions.clearActive()
      expect(store.getters.getActive()).toHaveLength(0)
    })

    test('should handle dirty state correctly', () => {
      const store = createRealEntityStore<typeof mockUsers[0]>()
      const user = createUser()

      store.actions.createOne(user)
      
      // Initially clean
      expect(store.getters.getOne(user.id)?.$isDirty).toBe(false)
      expect(store.getters.getDirtyEntities()).toHaveLength(0)
      expect(store.getters.getCleanEntities()).toHaveLength(1)

      // Update makes dirty
      store.actions.updateOne(user.id, { name: 'Updated' })
      expect(store.getters.getOne(user.id)?.$isDirty).toBe(true)
      expect(store.getters.getDirtyEntities()).toHaveLength(1)
      expect(store.getters.getCleanEntities()).toHaveLength(0)

      // Manually clean
      store.actions.setIsDirty(user.id, false)
      expect(store.getters.getOne(user.id)?.$isDirty).toBe(false)
      expect(store.getters.getDirtyEntities()).toHaveLength(0)
      expect(store.getters.getCleanEntities()).toHaveLength(1)
    })
  })

  describe('Query Operations', () => {
    test('should filter entities correctly', () => {
      const store = createRealEntityStore<typeof mockUsers[0]>()
      const users = [
        createUser({ id: '1', name: 'John Doe', age: 25 }),
        createUser({ id: '2', name: 'Jane Smith', age: 30 }),
        createUser({ id: '3', name: 'John Wilson', age: 35 })
      ]

      store.actions.createMany(users)

      // Filter by name containing "John"
      const johnsArray = store.getters.getWhereArray(user => user.name.includes('John'))
      expect(johnsArray).toHaveLength(2)
      expect(johnsArray.map(u => u.name)).toEqual(['John Doe', 'John Wilson'])

      // Filter by age > 30
      const olderUsers = store.getters.getWhereArray(user => user.age > 30)
      expect(olderUsers).toHaveLength(1)
      expect(olderUsers[0].name).toBe('John Wilson')

      // Find first John
      const firstJohn = store.getters.getFirstWhere(user => user.name.includes('John'))
      expect(firstJohn?.name).toBe('John Doe')
    })

    test('should find missing entities correctly', () => {
      const store = createRealEntityStore<typeof mockUsers[0]>()
      const allUsers = mockUsers.slice(0, 3)
      const existingUsers = allUsers.slice(0, 2)

      // Add only first 2 users
      store.actions.createMany(existingUsers)

      // Check missing IDs
      const allIds = allUsers.map(u => u.id)
      const missingIds = store.getters.getMissingIds(allIds)
      expect(missingIds).toHaveLength(1)
      expect(missingIds[0]).toBe(allUsers[2].id)

      // Check missing entities
      const missingEntities = store.getters.getMissingEntities(allUsers)
      expect(missingEntities).toHaveLength(1)
      expect(missingEntities[0]).toEqual(allUsers[2])
    })
  })

  describe('Configuration and Hooks', () => {
    test('should validate entities correctly', () => {
      const config: CoreConfig<typeof mockUsers[0]> = {
        validateEntity: (user) => user.age >= 18 && user.email.includes('@')
      }

      const store = createRealEntityStore(config)

      // Valid user
      const validUser = createUser({ age: 25, email: 'test@example.com' })
      expect(() => store.actions.createOne(validUser)).not.toThrow()

      // Invalid user (too young)
      const youngUser = createUser({ age: 16, email: 'young@example.com' })
      expect(() => store.actions.createOne(youngUser)).toThrow('Entity validation failed')

      // Invalid user (bad email)
      const badEmailUser = createUser({ age: 25, email: 'bademail' })
      expect(() => store.actions.createOne(badEmailUser)).toThrow('Entity validation failed')
    })

    test('should call lifecycle hooks correctly', () => {
      const onCreated = vi.fn()
      const onUpdated = vi.fn()
      const onDeleted = vi.fn()

      const config: CoreConfig<typeof mockUsers[0]> = {
        onEntityCreated: onCreated,
        onEntityUpdated: onUpdated,
        onEntityDeleted: onDeleted
      }

      const store = createRealEntityStore(config)
      const user = createUser()

      // Create
      store.actions.createOne(user)
      expect(onCreated).toHaveBeenCalledWith(user)
      expect(onCreated).toHaveBeenCalledTimes(1)

      // Update
      const updates = { name: 'Updated Name' }
      store.actions.updateOne(user.id, updates)
      expect(onUpdated).toHaveBeenCalledTimes(1)
      
      const [updatedEntity, previousEntity] = onUpdated.mock.calls[0]
      expect(updatedEntity.name).toBe('Updated Name')
      expect(previousEntity.name).toBe(user.name)

      // Delete
      store.actions.deleteOne(user.id)
      expect(onDeleted).toHaveBeenCalledTimes(1)
      
      const deletedEntity = onDeleted.mock.calls[0][0]
      expect(deletedEntity.name).toBe('Updated Name')
      expect(deletedEntity.$isDirty).toBe(true)
    })
  })

  describe('Error Handling and Edge Cases', () => {
    test('should handle operations on non-existent entities gracefully', () => {
      const store = createRealEntityStore<typeof mockUsers[0]>()

      // Update non-existent
      expect(() => store.actions.updateOne('non-existent', { name: 'Test' })).not.toThrow()
      
      // Delete non-existent
      expect(() => store.actions.deleteOne('non-existent')).not.toThrow()
      
      // Get non-existent
      expect(store.getters.getOne('non-existent')).toBeUndefined()
      
      // Set dirty on non-existent
      expect(() => store.actions.setIsDirty('non-existent')).not.toThrow()
    })

    test('should maintain data integrity during complex operations', () => {
      const store = createRealEntityStore<typeof mockUsers[0]>()
      // Créer des utilisateurs uniques pour éviter les doublons
      const users = Array.from({ length: 5 }, (_, i) => 
        createUser({ id: `unique-user-${i}`, name: `User ${i}` })
      )

      // Add users
      store.actions.createMany(users)
      expect(store.getters.getCount()).toBe(5)

      // Set some as current and active
      store.actions.setCurrent(users[0])
      store.actions.setActive(users[0].id)
      store.actions.setActive(users[1].id)

      // Delete current user
      store.actions.deleteOne(users[0].id)
      
      // Current should be cleared
      expect(store.getters.getCurrent()).toBeNull()
      
      // Active should be updated
      const active = store.getters.getActive()
      expect(active).not.toContain(users[0].id)
      expect(active).toContain(users[1].id)
      
      // Count should be updated
      expect(store.getters.getCount()).toBe(4)
    })

    test('should handle state reset correctly', () => {
      const store = createRealEntityStore<typeof mockUsers[0]>()
      const users = mockUsers.slice(0, 3)

      // Populate store
      store.actions.createMany(users)
      store.actions.setCurrent(users[0])
      store.actions.setActive(users[1].id)

      expect(store.getters.getCount()).toBe(3)
      expect(store.getters.getCurrent()).toBeDefined()
      expect(store.getters.getActive()).toHaveLength(1)

      // Reset
      store.actions.resetState()

      expect(store.getters.getCount()).toBe(0)
      expect(store.getters.getCurrent()).toBeNull()
      expect(store.getters.getActive()).toHaveLength(0)
      expect(store.getters.getIsEmpty()).toBe(true)
    })
  })

  describe('Performance and Scalability', () => {
    test('should handle large datasets efficiently', () => {
      const store = createRealEntityStore<typeof mockUsers[0]>()
      const largeDataset = Array.from({ length: 1000 }, (_, i) => 
        createUser({ id: `user-${i}`, name: `User ${i}`, age: 20 + (i % 50) })
      )

      const start = performance.now()
      store.actions.createMany(largeDataset)
      const createEnd = performance.now()

      expect(store.getters.getCount()).toBe(1000)
      expect(createEnd - start).toBeLessThan(100) // Should be fast

      // Test query performance
      const queryStart = performance.now()
      const youngUsers = store.getters.getWhereArray(user => user.age < 30)
      const queryEnd = performance.now()

      expect(youngUsers.length).toBeGreaterThan(0)
      expect(queryEnd - queryStart).toBeLessThan(50) // Queries should be fast

      // Test update performance
      const updateStart = performance.now()
      largeDataset.slice(0, 100).forEach(user => {
        store.actions.updateOne(user.id, { age: user.age + 1 })
      })
      const updateEnd = performance.now()

      expect(updateEnd - updateStart).toBeLessThan(100) // Updates should be fast
    })
  })
})
