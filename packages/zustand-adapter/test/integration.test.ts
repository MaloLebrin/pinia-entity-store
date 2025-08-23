import { beforeEach, describe, expect, test, vi } from 'vitest'
import { createUser } from '../core/test/fixtures/entities'
import { createZustandEntityStore } from '../index'

// Test d'intégration réelle avec le module core
describe('Zustand Adapter - Real Integration Tests', () => {
  let store: any
  let setState: any
  let getState: any

  beforeEach(() => {
    const storeCreator = createZustandEntityStore({
      validateEntity: (entity: any) => entity.name && entity.email,
      onEntityCreated: vi.fn(),
      onEntityUpdated: vi.fn(),
      onEntityDeleted: vi.fn()
    })

    // Simuler l'API Zustand
    store = storeCreator(
      (state: any) => state,
      (state: any) => state
    )

    // Extraire les fonctions set et get
    setState = (updates: any) => {
      Object.assign(store, updates)
    }
    getState = () => store
  })

  describe('Store Structure', () => {
    test('should have correct Zustand store structure', () => {
      expect(store).toHaveProperty('entities')
      expect(store.entities).toHaveProperty('byId')
      expect(store.entities).toHaveProperty('allIds')
      expect(store.entities).toHaveProperty('current')
      expect(store.entities).toHaveProperty('currentById')
      expect(store.entities).toHaveProperty('active')
    })

    test('should have all required actions', () => {
      expect(store).toHaveProperty('createOne')
      expect(store).toHaveProperty('createMany')
      expect(store).toHaveProperty('updateOne')
      expect(store).toHaveProperty('deleteOne')
      expect(store).toHaveProperty('setCurrent')
      expect(store).toHaveProperty('setActive')
      expect(store).toHaveProperty('setIsDirty')
      expect(store).toHaveProperty('updateField')
    })

    test('should have all required getters', () => {
      expect(store).toHaveProperty('getOne')
      expect(store).toHaveProperty('getMany')
      expect(store).toHaveProperty('getAll')
      expect(store).toHaveProperty('getAllArray')
      expect(store).toHaveProperty('getAllIds')
      expect(store).toHaveProperty('getWhere')
      expect(store).toHaveProperty('getWhereArray')
      expect(store).toHaveProperty('getFirstWhere')
      expect(store).toHaveProperty('getIsEmpty')
      expect(store).toHaveProperty('getIsNotEmpty')
      expect(store).toHaveProperty('getMissingIds')
      expect(store).toHaveProperty('getMissingEntities')
      expect(store).toHaveProperty('getCurrent')
      expect(store).toHaveProperty('getActive')
      expect(store).toHaveProperty('getFirstActive')
    })
  })

  describe('State Management', () => {
    test('should initialize with empty state', () => {
      const state = getState()
      expect(state.entities.byId).toEqual({})
      expect(state.entities.allIds).toEqual([])
      expect(state.entities.current).toBeNull()
      expect(state.entities.currentById).toBeNull()
      expect(state.entities.active).toEqual([])
    })

    test('should maintain state consistency', () => {
      const state1 = getState()
      const state2 = getState()
      expect(state1).toBe(state2) // Same reference in Zustand
    })
  })

  describe('Action Integration', () => {
    test('should create entities through actions', () => {
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      
      store.createOne(user)
      
      const state = getState()
      expect(state.entities.byId['user1']).toBeDefined()
      expect(state.entities.byId['user1'].name).toBe('John')
      expect(state.entities.byId['user1'].$isDirty).toBe(false)
      expect(state.entities.allIds).toContain('user1')
    })

    test('should handle batch creation', () => {
      const users = [
        createUser({ id: 'user1', name: 'John', email: 'john@example.com' }),
        createUser({ id: 'user2', name: 'Jane', email: 'jane@example.com' })
      ]
      
      store.createMany(users)
      
      const state = getState()
      expect(state.entities.allIds).toHaveLength(2)
      expect(state.entities.byId['user1']).toBeDefined()
      expect(state.entities.byId['user2']).toBeDefined()
    })

    test('should update entities correctly', () => {
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      store.createOne(user)
      
      store.updateOne('user1', { name: 'Johnny' })
      
      const state = getState()
      expect(state.entities.byId['user1'].name).toBe('Johnny')
      expect(state.entities.byId['user1'].$isDirty).toBe(true)
    })

    test('should delete entities correctly', () => {
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      store.createOne(user)
      
      store.deleteOne('user1')
      
      const state = getState()
      expect(state.entities.byId['user1']).toBeUndefined()
      expect(state.entities.allIds).not.toContain('user1')
    })

    test('should manage current entity', () => {
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      store.createOne(user)
      
      store.setCurrent(user)
      
      const state = getState()
      expect(state.entities.current).toEqual({ ...user, $isDirty: false })
    })

    test('should manage active entities', () => {
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      store.createOne(user)
      
      store.setActive('user1')
      
      const state = getState()
      expect(state.entities.active).toContain('user1')
    })

    test('should handle dirty state', () => {
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      store.createOne(user)
      
      store.setIsDirty('user1', true)
      
      const state = getState()
      expect(state.entities.byId['user1'].$isDirty).toBe(true)
    })

    test('should update specific fields', () => {
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      store.createOne(user)
      
      store.updateField('age', 25, 'user1')
      
      const state = getState()
      expect(state.entities.byId['user1'].age).toBe(25)
      expect(state.entities.byId['user1'].$isDirty).toBe(true)
    })
  })

  describe('Getter Integration', () => {
    beforeEach(() => {
      const users = [
        createUser({ id: 'user1', name: 'John', email: 'john@example.com', age: 25 }),
        createUser({ id: 'user2', name: 'Jane', email: 'jane@example.com', age: 30 }),
        createUser({ id: 'user3', name: 'Bob', email: 'bob@example.com', age: 35 })
      ]
      store.createMany(users)
    })

    test('should get single entity', () => {
      const user = store.getOne()('user1')
      expect(user).toBeDefined()
      expect(user.name).toBe('John')
    })

    test('should get multiple entities', () => {
      const users = store.getMany()(['user1', 'user2'])
      expect(users).toHaveLength(2)
      expect(users[0].name).toBe('John')
      expect(users[1].name).toBe('Jane')
    })

    test('should get all entities', () => {
      const allEntities = store.getAll()
      expect(Object.keys(allEntities)).toHaveLength(3)
    })

    test('should get all entities as array', () => {
      const allArray = store.getAllArray()
      expect(allArray).toHaveLength(3)
    })

    test('should get all IDs', () => {
      const allIds = store.getAllIds()
      expect(allIds).toHaveLength(3)
      expect(allIds).toContain('user1')
      expect(allIds).toContain('user2')
      expect(allIds).toContain('user3')
    })

    test('should filter entities', () => {
      const youngUsers = store.getWhere()((user: any) => user.age < 30)
      expect(Object.keys(youngUsers)).toHaveLength(1)
      expect(youngUsers['user1'].name).toBe('John')
    })

    test('should filter entities as array', () => {
      const youngUsers = store.getWhereArray()((user: any) => user.age < 30)
      expect(youngUsers).toHaveLength(1)
      expect(youngUsers[0].name).toBe('John')
    })

    test('should find first matching entity', () => {
      const user = store.getFirstWhere()((user: any) => user.age > 30)
      expect(user).toBeDefined()
      expect(user.name).toBe('Jane')
    })

    test('should check if store is empty', () => {
      expect(store.getIsEmpty()).toBe(false)
      expect(store.getIsNotEmpty()).toBe(true)
    })

    test('should find missing IDs', () => {
      const missingIds = store.getMissingIds()(['user1', 'user4', 'user5'])
      expect(missingIds).toHaveLength(2)
      expect(missingIds).toContain('user4')
      expect(missingIds).toContain('user5')
    })

    test('should find missing entities', () => {
      const existingUser = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      const missingUser = createUser({ id: 'user4', name: 'Alice', email: 'alice@example.com' })
      
      const missingEntities = store.getMissingEntities()([existingUser, missingUser])
      expect(missingEntities).toHaveLength(1)
      expect(missingEntities[0].id).toBe('user4')
    })

    test('should get current entity', () => {
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      store.setCurrent(user)
      
      const current = store.getCurrent()
      expect(current).toEqual({ ...user, $isDirty: false })
    })

    test('should get active entities', () => {
      store.setActive('user1')
      store.setActive('user2')
      
      const active = store.getActive()
      expect(active).toContain('user1')
      expect(active).toContain('user2')
    })

    test('should get first active entity', () => {
      store.setActive('user1')
      store.setActive('user2')
      
      const firstActive = store.getFirstActive()
      expect(firstActive).toBe('user1')
    })
  })

  describe('Configuration and Hooks', () => {
    test('should validate entities on creation', () => {
      const invalidUser = createUser({ id: 'user1', name: '', email: 'invalid-email' })
      
      expect(() => {
        store.createOne(invalidUser)
      }).toThrow()
    })

    test('should call lifecycle hooks', () => {
      const onCreated = vi.fn()
      const onUpdated = vi.fn()
      const onDeleted = vi.fn()
      
      const storeWithHooks = createZustandEntityStore({
        onEntityCreated: onCreated,
        onEntityUpdated: onUpdated,
        onEntityDeleted: onDeleted
      })

      const hookStore = storeWithHooks(
        (state: any) => state,
        (state: any) => state
      )
      
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      
      hookStore.createOne(user)
      expect(onCreated).toHaveBeenCalledWith(user)
      
      hookStore.updateOne('user1', { name: 'Johnny' })
      expect(onUpdated).toHaveBeenCalled()
      
      hookStore.deleteOne('user1')
      expect(onDeleted).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    test('should handle operations on non-existent entities gracefully', () => {
      expect(() => {
        store.updateOne('non-existent', { name: 'New Name' })
      }).not.toThrow()
      
      expect(() => {
        store.deleteOne('non-existent')
      }).not.toThrow()
      
      expect(() => {
        store.setActive('non-existent')
      }).not.toThrow()
    })

    test('should handle invalid entity data', () => {
      const invalidUser = { id: 'user1' } // Missing required fields
      
      expect(() => {
        store.createOne(invalidUser)
      }).toThrow()
    })
  })

  describe('Performance and Scalability', () => {
    test('should handle large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 100 }, (_, i) => 
        createUser({ 
          id: `user-${i}`, 
          name: `User ${i}`, 
          email: `user${i}@example.com`,
          age: 20 + (i % 50)
        })
      )
      
      const startTime = performance.now()
      store.createMany(largeDataset)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(100) // Should complete in less than 100ms
      
      const state = getState()
      expect(state.entities.allIds).toHaveLength(100)
    })
  })

  describe('Zustand-Specific Features', () => {
    test('should work with Zustand middleware', () => {
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      store.createOne(user)
      
      // Simuler l'utilisation avec Zustand
      const zustandStore = {
        getState: () => store,
        setState: (updates: any) => {
          Object.assign(store, updates)
        },
        subscribe: vi.fn()
      }
      
      expect(zustandStore.getState().entities.byId['user1']).toBeDefined()
    })

    test('should handle state updates through Zustand setState', () => {
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      store.createOne(user)
      
      // Simuler une mise à jour via Zustand
      setState({
        entities: {
          ...store.entities,
          byId: {
            ...store.entities.byId,
            'user1': { ...store.entities.byId['user1'], name: 'Johnny' }
          }
        }
      })
      
      const state = getState()
      expect(state.entities.byId['user1'].name).toBe('Johnny')
    })
  })
})
