import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { createApp } from 'vue'
import type { User } from '../../../core/test/fixtures/entities'
import { useUserStore } from '../stores/userStore'

describe('Pinia Adapter - Vue Integration Tests', () => {
  let app: any
  let pinia: any

  beforeEach(() => {
    // Créer une nouvelle instance Vue + Pinia pour chaque test
    app = createApp({})
    pinia = createPinia()
    app.use(pinia)
    setActivePinia(pinia)
  })

  afterEach(() => {
    // Nettoyer après chaque test
    if (app) {
      app.unmount()
    }
  })

  describe('Store Initialization', () => {
    test('should initialize store with empty state', () => {
      const userStore = useUserStore()
      
      expect(userStore.getAllIds()).toEqual([])
      expect(userStore.getIsEmpty()).toBe(true)
      expect(userStore.getCurrent()).toBeNull()
      expect(userStore.getActive()).toEqual([])
    })

    test('should have all required methods', () => {
      const userStore = useUserStore()
      
      expect(typeof userStore.createOne).toBe('function')
      expect(typeof userStore.createMany).toBe('function')
      expect(typeof userStore.updateOne).toBe('function')
      expect(typeof userStore.deleteOne).toBe('function')
      expect(typeof userStore.setCurrent).toBe('function')
      expect(typeof userStore.setActive).toBe('function')
      expect(typeof userStore.setIsDirty).toBe('function')
      expect(typeof userStore.updateField).toBe('function')
    })

    test('should have all required getters', () => {
      const userStore = useUserStore()
      
      expect(typeof userStore.getOne).toBe('function')
      expect(typeof userStore.getMany).toBe('function')
      expect(typeof userStore.getAll).toBe('function')
      expect(typeof userStore.getAllArray).toBe('function')
      expect(typeof userStore.getAllIds).toBe('function')
      expect(typeof userStore.getWhere).toBe('function')
      expect(typeof userStore.getWhereArray).toBe('function')
      expect(typeof userStore.getFirstWhere).toBe('function')
      expect(typeof userStore.getIsEmpty).toBe('function')
      expect(typeof userStore.getIsNotEmpty).toBe('function')
      expect(typeof userStore.getMissingIds).toBe('function')
      expect(typeof userStore.getMissingEntities).toBe('function')
      expect(typeof userStore.getCurrent).toBe('function')
      expect(typeof userStore.getActive).toBe('function')
      expect(typeof userStore.getFirstActive).toBe('function')
    })
  })

  describe('Entity Management', () => {
    test('should create and retrieve entities', () => {
      const userStore = useUserStore()
      
      const user: User = {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        isActive: true
      }
      
      userStore.createOne(user)
      
      expect(userStore.getIsEmpty()).toBe(false)
      expect(userStore.getAllIds()).toContain('user1')
      expect(userStore.getOne()('user1')).toEqual({
        ...user,
        $isDirty: false
      })
    })

    test('should handle batch creation', () => {
      const userStore = useUserStore()
      
      const users: User[] = [
        { id: 'user1', name: 'John', email: 'john@example.com', age: 30, isActive: true },
        { id: 'user2', name: 'Jane', email: 'jane@example.com', age: 25, isActive: true }
      ]
      
      userStore.createMany(users)
      
      expect(userStore.getAllIds()).toHaveLength(2)
      expect(userStore.getOne()('user1')).toBeDefined()
      expect(userStore.getOne()('user2')).toBeDefined()
    })

    test('should update entities correctly', () => {
      const userStore = useUserStore()
      
      const user: User = {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        isActive: true
      }
      
      userStore.createOne(user)
      userStore.updateOne('user1', { age: 31 })
      
      const updatedUser = userStore.getOne()('user1')
      expect(updatedUser?.age).toBe(31)
      expect(updatedUser?.$isDirty).toBe(true)
    })

    test('should delete entities correctly', () => {
      const userStore = useUserStore()
      
      const user: User = {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        isActive: true
      }
      
      userStore.createOne(user)
      expect(userStore.getAllIds()).toHaveLength(1)
      
      userStore.deleteOne('user1')
      expect(userStore.getAllIds()).toHaveLength(0)
      expect(userStore.getOne()('user1')).toBeUndefined()
    })
  })

  describe('State Management', () => {
    test('should manage current entity', () => {
      const userStore = useUserStore()
      
      const user: User = {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        isActive: true
      }
      
      userStore.createOne(user)
      userStore.setCurrent(user)
      
      expect(userStore.getCurrent()).toEqual({
        ...user,
        $isDirty: false
      })
    })

    test('should manage active entities', () => {
      const userStore = useUserStore()
      
      const user: User = {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        isActive: true
      }
      
      userStore.createOne(user)
      userStore.setActive('user1')
      
      expect(userStore.getActive()).toContain('user1')
      expect(userStore.getFirstActive()).toBe('user1')
    })

    test('should handle dirty state', () => {
      const userStore = useUserStore()
      
      const user: User = {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        isActive: true
      }
      
      userStore.createOne(user)
      userStore.setIsDirty('user1', true)
      
      expect(userStore.getOne()('user1')?.$isDirty).toBe(true)
      
      userStore.setIsDirty('user1', false)
      expect(userStore.getOne()('user1')?.$isDirty).toBe(false)
    })
  })

  describe('Query Operations', () => {
    beforeEach(() => {
      const userStore = useUserStore()
      
      const users: User[] = [
        { id: 'user1', name: 'John Doe', email: 'john@example.com', age: 30, isActive: true },
        { id: 'user2', name: 'Jane Smith', email: 'jane@example.com', age: 25, isActive: true },
        { id: 'user3', name: 'Bob Johnson', email: 'bob@example.com', age: 35, isActive: false }
      ]
      
      userStore.createMany(users)
    })

    test('should filter entities correctly', () => {
      const userStore = useUserStore()
      
      const activeUsers = userStore.getWhereArray()((user: any) => user.isActive)
      expect(activeUsers).toHaveLength(2)
      
      const youngUsers = userStore.getWhereArray()((user: any) => user.age < 30)
      expect(youngUsers).toHaveLength(1)
      expect(youngUsers[0].name).toBe('Jane Smith')
    })

    test('should find missing entities', () => {
      const userStore = useUserStore()
      
      const existingIds = ['user1', 'user2']
      const nonExistingIds = ['user4', 'user5']
      const mixedIds = [...existingIds, ...nonExistingIds]
      
      const missingIds = userStore.getMissingIds()(mixedIds)
      expect(missingIds).toEqual(nonExistingIds)
    })

    test('should get multiple entities by IDs', () => {
      const userStore = useUserStore()
      
      const users = userStore.getMany()(['user1', 'user2'])
      expect(users).toHaveLength(2)
      expect(users[0]?.name).toBe('John Doe')
      expect(users[1]?.name).toBe('Jane Smith')
    })
  })

  describe('Validation and Hooks', () => {
    test('should validate entities on creation', () => {
      const userStore = useUserStore()
      
      const invalidUser = {
        id: 'user1',
        name: '', // Nom vide
        email: 'invalid-email', // Email invalide
        age: -5, // Âge invalide
        isActive: true
      }
      
      expect(() => {
        userStore.createOne(invalidUser as User)
      }).toThrow()
      
      expect(userStore.getIsEmpty()).toBe(true)
    })

    test('should call lifecycle hooks', () => {
      const userStore = useUserStore()
      
      const user: User = {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        isActive: true
      }
      
      // Les hooks sont définis dans la configuration du store
      // Nous testons que l'opération ne lance pas d'erreur
      expect(() => {
        userStore.createOne(user)
        userStore.updateOne('user1', { age: 31 })
        userStore.deleteOne('user1')
      }).not.toThrow()
    })
  })

  describe('Performance and Scalability', () => {
    test('should handle large datasets efficiently', () => {
      const userStore = useUserStore()
      
      const largeDataset: User[] = Array.from({ length: 100 }, (_, i) => ({
        id: `user-${i}`,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        age: 20 + (i % 50),
        isActive: i % 2 === 0
      }))
      
      const startTime = performance.now()
      userStore.createMany(largeDataset)
      const endTime = performance.now()
      
      expect(userStore.getAllIds()).toHaveLength(100)
      expect(endTime - startTime).toBeLessThan(100) // Doit être rapide
    })

    test('should handle rapid state mutations', () => {
      const userStore = useUserStore()
      
      const user: User = {
        id: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        age: 30,
        isActive: true
      }
      
      userStore.createOne(user)
      
      const startTime = performance.now()
      
      // 100 mutations rapides
      for (let i = 0; i < 100; i++) {
        userStore.updateField('age', 30 + i, 'user1')
        userStore.setIsDirty('user1', i % 2 === 0)
      }
      
      const endTime = performance.now()
      
      expect(userStore.getOne()('user1')?.age).toBe(129)
      expect(endTime - startTime).toBeLessThan(50) // Doit être très rapide
    })
  })
})
