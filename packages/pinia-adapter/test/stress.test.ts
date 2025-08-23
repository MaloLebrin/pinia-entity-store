import { beforeEach, describe, expect, test } from 'vitest'
import { createUser } from '../../core/test/fixtures/entities'
import { createPiniaEntityStore } from '../index'

describe('Pinia Adapter - Stress and Performance Tests', () => {
  let store: any

  beforeEach(() => {
    store = createPiniaEntityStore({
      storeName: 'stress-test-store',
      validateEntity: (entity: any) => {
        // Retourner true si l'entité est valide, false sinon
        return !!(entity.name && entity.email && entity.name.length > 0 && entity.email.includes('@'))
      }
    })
  })

  describe('Large Dataset Operations', () => {
    test('should handle 1000 entities creation efficiently', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => 
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
      
      const state = store.state()
      expect(state.entities.allIds).toHaveLength(1000)
      expect(endTime - startTime).toBeLessThan(500) // Should complete in less than 500ms
    })

    test('should handle 1000 entities updates efficiently', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => 
        createUser({ 
          id: `user-${i}`, 
          name: `User ${i}`, 
          email: `user${i}@example.com`,
          age: 20 + (i % 50)
        })
      )
      
      store.actions.createMany(largeDataset)
      
      const startTime = performance.now()
      largeDataset.forEach(user => {
        store.actions.updateOne(user.id, { age: user.age + 1 })
      })
      const endTime = performance.now()
      
      const state = store.state()
      expect(state.entities.allIds).toHaveLength(1000)
      expect(endTime - startTime).toBeLessThan(1000) // Should complete in less than 1s
    })

    test('should handle 1000 entities deletion efficiently', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => 
        createUser({ 
          id: `user-${i}`, 
          name: `User ${i}`, 
          email: `user${i}@example.com`,
          age: 20 + (i % 50)
        })
      )
      
      store.actions.createMany(largeDataset)
      
      const startTime = performance.now()
      largeDataset.forEach(user => {
        store.actions.deleteOne(user.id)
      })
      const endTime = performance.now()
      
      const state = store.state()
      expect(state.entities.allIds).toHaveLength(0)
      expect(endTime - startTime).toBeLessThan(1000) // Should complete in less than 1s
    })
  })

  describe('Concurrent Operations', () => {
    test('should handle concurrent create operations', async () => {
      const promises = Array.from({ length: 100 }, (_, i) => 
        Promise.resolve().then(() => {
          const user = createUser({ 
            id: `user-${i}`, 
            name: `User ${i}`, 
            email: `user${i}@example.com` 
          })
          store.actions.createOne(user)
        })
      )
      
      const startTime = performance.now()
      await Promise.all(promises)
      const endTime = performance.now()
      
      const state = store.state()
      expect(state.entities.allIds).toHaveLength(100)
      expect(endTime - startTime).toBeLessThan(200) // Should complete in less than 200ms
    })

    test('should handle concurrent update operations', async () => {
      const users = Array.from({ length: 100 }, (_, i) => 
        createUser({ 
          id: `user-${i}`, 
          name: `User ${i}`, 
          email: `user${i}@example.com`,
          age: 20
        })
      )
      
      store.actions.createMany(users)
      
      const promises = users.map(user => 
        Promise.resolve().then(() => {
          store.actions.updateOne(user.id, { age: user.age + 1 })
        })
      )
      
      const startTime = performance.now()
      await Promise.all(promises)
      const endTime = performance.now()
      
      const state = store.state()
      expect(state.entities.allIds).toHaveLength(100)
      expect(endTime - startTime).toBeLessThan(200) // Should complete in less than 200ms
    })
  })

  describe('Memory Usage', () => {
    test('should not leak memory during large operations', () => {
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0
      
      // Créer et supprimer 1000 entités plusieurs fois
      for (let cycle = 0; cycle < 5; cycle++) {
        const largeDataset = Array.from({ length: 1000 }, (_, i) => 
          createUser({ 
            id: `user-${cycle}-${i}`, 
            name: `User ${cycle}-${i}`, 
            email: `user${cycle}-${i}@example.com`,
            age: 20 + (i % 50)
          })
        )
        
        store.actions.createMany(largeDataset)
        
        // Vérifier que toutes les entités sont créées
        const state = store.state()
        expect(state.entities.allIds).toHaveLength(1000)
        
        // Supprimer toutes les entités
        largeDataset.forEach(user => {
          store.actions.deleteOne(user.id)
        })
        
        // Vérifier que toutes les entités sont supprimées
        const finalState = store.state()
        expect(finalState.entities.allIds).toHaveLength(0)
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0
      const memoryIncrease = finalMemory - initialMemory
      
      // La consommation mémoire ne devrait pas augmenter de plus de 10MB
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024)
    })
  })

  describe('Complex Queries Performance', () => {
    beforeEach(() => {
              const largeDataset = Array.from({ length: 1000 }, (_, i) => 
          createUser({ 
            id: `user-${i}`, 
            name: `User ${i}`, 
            email: `user${i}@example.com`,
            age: 20 + (i % 50),
            isActive: i % 2 === 0
          })
        )
      store.actions.createMany(largeDataset)
    })

    test('should filter large datasets efficiently', () => {
      const startTime = performance.now()
      
      // Filtres complexes
      const youngActive = store.getters.getWhereArray()((user: any) => 
        user.age < 30 && user.isActive
      )
      const oldInactive = store.getters.getWhereArray()((user: any) => 
        user.age > 40 && !user.isActive
      )
      const middleAge = store.getters.getWhereArray()((user: any) => 
        user.age >= 30 && user.age <= 40
      )
      
      const endTime = performance.now()
      
      expect(youngActive.length).toBeGreaterThan(0)
      expect(oldInactive.length).toBeGreaterThan(0)
      expect(middleAge.length).toBeGreaterThan(0)
      expect(endTime - startTime).toBeLessThan(50) // Should complete in less than 50ms
    })

    test('should find missing entities efficiently', () => {
      const existingIds = Array.from({ length: 100 }, (_, i) => `user-${i}`)
      const nonExistingIds = Array.from({ length: 100 }, (_, i) => `non-existent-${i}`)
      const mixedIds = [...existingIds, ...nonExistingIds]
      
      const startTime = performance.now()
      const missingIds = store.getters.getMissingIds()(mixedIds)
      const endTime = performance.now()
      
      expect(missingIds).toHaveLength(100)
      expect(missingIds).toEqual(nonExistingIds)
      expect(endTime - startTime).toBeLessThan(50) // Should complete in less than 50ms
    })
  })

  describe('State Mutation Performance', () => {
    test('should handle rapid state mutations efficiently', () => {
      const user = createUser({ id: 'user1', name: 'John', email: 'john@example.com', age: 25 })
      store.actions.createOne(user)
      
      const startTime = performance.now()
      
      // 1000 mutations rapides
      for (let i = 0; i < 1000; i++) {
        store.actions.updateField('age', 25 + i, 'user1')
        store.actions.setIsDirty('user1', i % 2 === 0)
        store.actions.setActive('user1')
      }
      
      const endTime = performance.now()
      
      const state = store.state()
      expect(state.entities.byId['user1'].age).toBe(1024)
      expect(endTime - startTime).toBeLessThan(100) // Should complete in less than 100ms
    })
  })

  describe('Edge Cases and Error Recovery', () => {
    test('should handle malformed data gracefully', () => {
      const malformedData = [
        { id: 'user1', name: 'John' }, // Missing email
        { id: 'user2', email: 'jane@example.com' }, // Missing name
        { id: 'user3', name: '', email: 'bob@example.com' }, // Empty name
        { id: 'user4', name: 'Alice', email: 'invalid-email' } // Invalid email
      ]
      
      let successCount = 0
      let errorCount = 0
      
      malformedData.forEach(data => {
        try {
          store.actions.createOne(data)
          successCount++
        } catch {
          errorCount++
        }
      })
      
      expect(successCount).toBe(0) // All should fail validation
      expect(errorCount).toBe(4)
      
      const state = store.state()
      expect(state.entities.allIds).toHaveLength(0)
    })

    test('should recover from errors and continue operations', () => {
      const validUser = createUser({ id: 'user1', name: 'John', email: 'john@example.com' })
      const invalidUser = { id: 'user2' } // Missing required fields
      
      // Try to create invalid user (should fail)
      expect(() => {
        store.actions.createOne(invalidUser)
      }).toThrow()
      
      // Should still be able to create valid user
      store.actions.createOne(validUser)
      
      const state = store.state()
      expect(state.entities.byId['user1']).toBeDefined()
      expect(state.entities.byId['user2']).toBeUndefined()
      expect(state.entities.allIds).toHaveLength(1)
    })
  })
})
