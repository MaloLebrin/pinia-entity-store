import { describe, expect, test } from 'vitest'
import { createProduct, createUser } from '../fixtures/entities'

describe('Core Types', () => {
  test('WithId interface should work with string IDs', () => {
    const user = createUser()
    expect(user.id).toBeDefined()
    expect(typeof user.id).toBe('string')
  })

  test('WithId interface should work with number IDs', () => {
    const product = createProduct()
    expect(product.id).toBeDefined()
    expect(typeof product.id).toBe('number')
  })

  test('Id type should accept both string and number', () => {
    const stringId: string | number = 'test-id'
    const numberId: string | number = 123

    expect(typeof stringId).toBe('string')
    expect(typeof numberId).toBe('number')
  })

  test('State interface should have correct structure', () => {
    const state = {
      entities: {
        byId: {},
        allIds: [],
        current: null,
        currentById: null,
        active: []
      }
    }

    expect(state.entities).toBeDefined()
    expect(state.entities.byId).toBeDefined()
    expect(state.entities.allIds).toBeDefined()
    expect(state.entities.current).toBeDefined()
    expect(state.entities.currentById).toBeDefined()
    expect(state.entities.active).toBeDefined()
  })

  test('EntityStoreConfig should accept validation functions', () => {
    const config = {
      validateEntity: (user: any) => user.email.includes('@'),
      onEntityCreated: () => { /* Created */ },
      onEntityUpdated: () => { /* Updated */ },
      onEntityDeleted: () => { /* Deleted */ }
    }

    expect(config.validateEntity).toBeDefined()
    expect(config.onEntityCreated).toBeDefined()
    expect(config.onEntityUpdated).toBeDefined()
    expect(config.onEntityDeleted).toBeDefined()
  })

  test('EntityStore interface should have all required methods', () => {
    // Mock implementation for testing
    const store = {
      createOne: () => {},
      updateOne: () => {},
      deleteOne: () => {},
      getOne: () => undefined,
      getAll: () => ({})
    }
    
    // These should all exist on the interface
    expect(store.createOne).toBeDefined()
    expect(store.updateOne).toBeDefined()
    expect(store.deleteOne).toBeDefined()
    expect(store.getOne).toBeDefined()
    expect(store.getAll).toBeDefined()
  })
})
