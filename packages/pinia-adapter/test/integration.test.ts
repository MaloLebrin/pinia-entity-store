import { beforeEach, describe, expect, test, vi } from 'vitest'
import { createUser } from '../../core/test/fixtures/entities'
import { createPiniaEntityStore } from '../index'

// Test d'intégration réelle avec le module core
describe('Pinia Adapter - Real Integration Tests', () => {
  let store: any

  beforeEach(() => {
    store = createPiniaEntityStore({
      storeName: 'test-store',
      validateEntity: (entity: any) => {
        // Retourner true si l'entité est valide, false sinon
        return !!(entity.name && entity.email && entity.name.length > 0 && entity.email.includes('@'))
      },
      onEntityCreated: vi.fn(),
      onEntityUpdated: vi.fn(),
      onEntityDeleted: vi.fn()
    })
  })

  describe('Store Structure', () => {
    test('should have correct Pinia store structure', () => {
      expect(store).toHaveProperty('id')
      expect(store).toHaveProperty('state')
      expect(store).toHaveProperty('getters')
      expect(store).toHaveProperty('actions')
      expect(store.id).toBe('test-store')
    })

    test('should have all required actions', () => {
      const actions = store.actions
      expect(actions).toHaveProperty('createOne')
      expect(actions).toHaveProperty('createMany')
      expect(actions).toHaveProperty('updateOne')
      expect(actions).toHaveProperty('deleteOne')
      expect(actions).toHaveProperty('setCurrent')
      expect(actions).toHaveProperty('setActive')
      expect(actions).toHaveProperty('setIsDirty')
      expect(actions).toHaveProperty('updateField')
    })

    test('should have all required getters', () => {
      const getters = store.getters
      expect(getters).toHaveProperty('getOne')
      expect(getters).toHaveProperty('getMany')
      expect(getters).toHaveProperty('getAll')
      expect(getters).toHaveProperty('getAllArray')
      expect(getters).toHaveProperty('getAllIds')
      expect(getters).toHaveProperty('getWhere')
      expect(getters).toHaveProperty('getWhereArray')
      expect(getters).toHaveProperty('getFirstWhere')
      expect(getters).toHaveProperty('getIsEmpty')
      expect(getters).toHaveProperty('getIsNotEmpty')
      expect(getters).toHaveProperty('getMissingIds')
      expect(getters).toHaveProperty('getMissingEntities')
      expect(getters).toHaveProperty('getCurrent')
      expect(getters).toHaveProperty('getActive')
      expect(getters).toHaveProperty('getFirstActive')
    })
  })

  describe('State Management', () => {
    test('should initialize with empty state', () => {
      const initialState = store.state()
      expect(initialState.entities.byId).toEqual({})
      expect(initialState.entities.allIds).toEqual([])
      expect(initialState.entities.current).toBeNull()
      expect(initialState.entities.currentById).toBeNull()
      expect(initialState.entities.active).toEqual([])
    })

    test('should maintain state consistency', () => {
      const state1 = store.state()
      const state2 = store.state()
      expect(state1).toStrictEqual(state2) // Deep equality check
    })
  })

  describe('Action Integration', () => {
    test('should create entities through actions', () => {
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      
      store.actions.createOne(user)
      
      const state = store.state()
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
      
      store.actions.createMany(users)
      
      const state = store.state()
      expect(state.entities.allIds).toHaveLength(2)
      expect(state.entities.byId['user1']).toBeDefined()
      expect(state.entities.byId['user2']).toBeDefined()
    })

    test('should update entities correctly', () => {
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      store.actions.createOne(user)
      
      store.actions.updateOne('user1', { name: 'Johnny' })
      
      const state = store.state()
      expect(state.entities.byId['user1'].name).toBe('Johnny')
      expect(state.entities.byId['user1'].$isDirty).toBe(true)
    })

    test('should delete entities correctly', () => {
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      store.actions.createOne(user)
      
      store.actions.deleteOne('user1')
      
      const state = store.state()
      expect(state.entities.byId['user1']).toBeUndefined()
      expect(state.entities.allIds).not.toContain('user1')
    })

    test('should manage current entity', () => {
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      store.actions.createOne(user)
      
      store.actions.setCurrent(user)
      
      const state = store.state()
      expect(state.entities.current).toEqual({ ...user, $isDirty: false })
    })

    test('should manage active entities', () => {
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      store.actions.createOne(user)
      
      store.actions.setActive('user1')
      
      const state = store.state()
      expect(state.entities.active).toContain('user1')
    })

    test('should handle dirty state', () => {
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      store.actions.createOne(user)
      
      store.actions.setIsDirty('user1', true)
      
      const state = store.state()
      expect(state.entities.byId['user1'].$isDirty).toBe(true)
    })

    test('should update specific fields', () => {
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      store.actions.createOne(user)
      
      store.actions.updateField('age', 25, 'user1')
      
      const state = store.state()
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
      store.actions.createMany(users)
    })

    test('should get single entity', () => {
      const user = store.getters.getOne()('user1')
      expect(user).toBeDefined()
      expect(user.name).toBe('John')
    })

    test('should get multiple entities', () => {
      const users = store.getters.getMany()(['user1', 'user2'])
      expect(users).toHaveLength(2)
      expect(users[0].name).toBe('John')
      expect(users[1].name).toBe('Jane')
    })

    test('should get all entities', () => {
      const allEntities = store.getters.getAll()
      expect(Object.keys(allEntities)).toHaveLength(3)
    })

    test('should get all entities as array', () => {
      const allArray = store.getters.getAllArray()
      expect(allArray).toHaveLength(3)
    })

    test('should get all IDs', () => {
      const allIds = store.getters.getAllIds()
      expect(allIds).toHaveLength(3)
      expect(allIds).toContain('user1')
      expect(allIds).toContain('user2')
      expect(allIds).toContain('user3')
    })

    test('should filter entities', () => {
      const youngUsers = store.getters.getWhere()((user: any) => user.age < 30)
      expect(Object.keys(youngUsers)).toHaveLength(1)
      expect(youngUsers['user1'].name).toBe('John')
    })

    test('should filter entities as array', () => {
      const youngUsers = store.getters.getWhereArray()((user: any) => user.age < 30)
      expect(youngUsers).toHaveLength(1)
      expect(youngUsers[0].name).toBe('John')
    })

    test('should find first matching entity', () => {
      const user = store.getters.getFirstWhere()((user: any) => user.age > 30)
      expect(user).toBeDefined()
      expect(user.name).toBe('Jane')
    })

    test('should check if store is empty', () => {
      expect(store.getters.getIsEmpty()).toBe(false)
      expect(store.getters.getIsNotEmpty()).toBe(true)
    })

    test('should find missing IDs', () => {
      const missingIds = store.getters.getMissingIds()(['user1', 'user4', 'user5'])
      expect(missingIds).toHaveLength(2)
      expect(missingIds).toContain('user4')
      expect(missingIds).toContain('user5')
    })

    test('should find missing entities', () => {
      const existingUser = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      const missingUser = createUser({ id: 'user4', name: 'Alice', email: 'alice@example.com' })
      
      const missingEntities = store.getters.getMissingEntities()([existingUser, missingUser])
      expect(missingEntities).toHaveLength(1)
      expect(missingEntities[0].id).toBe('user4')
    })

    test('should get current entity', () => {
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      store.actions.setCurrent(user)
      
      const current = store.getters.getCurrent()
      expect(current).toEqual({ ...user, $isDirty: false })
    })

    test('should get active entities', () => {
      store.actions.setActive('user1')
      store.actions.setActive('user2')
      
      const active = store.getters.getActive()
      expect(active).toContain('user1')
      expect(active).toContain('user2')
    })

    test('should get first active entity', () => {
      store.actions.setActive('user1')
      store.actions.setActive('user2')
      
      const firstActive = store.getters.getFirstActive()
      expect(firstActive).toBe('user1')
    })
  })

  describe('Configuration and Hooks', () => {
    test('should validate entities on creation', () => {
      const invalidUser = createUser({ id: 'user1', name: '', email: 'invalid-email' })
      
      expect(() => {
        store.actions.createOne(invalidUser)
      }).toThrow()
    })

    test('should call lifecycle hooks', () => {
      const onCreated = vi.fn()
      const onUpdated = vi.fn()
      const onDeleted = vi.fn()
      
      const storeWithHooks = createPiniaEntityStore({
        storeName: 'hooks-store',
        onEntityCreated: onCreated,
        onEntityUpdated: onUpdated,
        onEntityDeleted: onDeleted
      })
      
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      
      storeWithHooks.actions.createOne(user)
      expect(onCreated).toHaveBeenCalledWith(user)
      
      storeWithHooks.actions.updateOne('user1', { name: 'Johnny' })
      expect(onUpdated).toHaveBeenCalled()
      
      storeWithHooks.actions.deleteOne('user1')
      expect(onDeleted).toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    test('should handle operations on non-existent entities gracefully', () => {
      expect(() => {
        store.actions.updateOne('non-existent', { name: 'New Name' })
      }).not.toThrow()
      
      expect(() => {
        store.actions.deleteOne('non-existent')
      }).not.toThrow()
      
      expect(() => {
        store.actions.setActive('non-existent')
      }).not.toThrow()
    })

    test('should handle invalid entity data', () => {
      const invalidUser = { id: 'user1' } // Missing required fields
      
      expect(() => {
        store.actions.createOne(invalidUser)
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
      store.actions.createMany(largeDataset)
      const endTime = performance.now()
      
      expect(endTime - startTime).toBeLessThan(100) // Should complete in less than 100ms
      
      const state = store.state()
      expect(state.entities.allIds).toHaveLength(100)
    })
  })
})
