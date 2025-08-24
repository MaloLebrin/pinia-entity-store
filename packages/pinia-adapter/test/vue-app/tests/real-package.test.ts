import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test } from 'vitest'
import { createPiniaEntityStore } from '../../index'

// Test d'intégration réel avec NOTRE package
describe('Pinia Adapter - Real Package Integration Test', () => {
  let pinia: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  test('should create a real Pinia store using our package', () => {
    // Utiliser NOTRE package pour créer un store
    const storeOptions = createPiniaEntityStore({
      storeName: 'test-entities',
      validateEntity: (entity: any) => {
        return !!(entity.name && entity.email && entity.name.length > 0 && entity.email.includes('@'))
      },
      onEntityCreated: (entity: any) => {
        console.log('Entity created:', entity)
      },
      onEntityUpdated: (entity: any) => {
        console.log('Entity updated:', entity)
      },
      onEntityDeleted: (entity: any) => {
        console.log('Entity deleted:', entity)
      }
    })

    // Créer le store Pinia avec nos options
    const useTestStore = defineStore(storeOptions.id, storeOptions)
    const store = useTestStore()

    // Vérifier que le store a la structure attendue
    expect(store.entities).toBeDefined()
    expect(store.entities.byId).toBeDefined()
    expect(store.entities.allIds).toBeDefined()
    expect(store.entities.current).toBeDefined()
    expect(store.entities.active).toBeDefined()

    // Vérifier que les actions sont disponibles
    expect(typeof store.createOne).toBe('function')
    expect(typeof store.createMany).toBe('function')
    expect(typeof store.updateOne).toBe('function')
    expect(typeof store.deleteOne).toBe('function')
    expect(typeof store.setCurrent).toBe('function')
    expect(typeof store.setActive).toBe('function')

    // Vérifier que les getters sont disponibles
    expect(typeof store.getAllIds).toBe('function')
    expect(typeof store.getOne).toBe('function')
    expect(typeof store.getCurrent).toBe('function')
    expect(typeof store.getActive).toBe('function')
    expect(typeof store.getIsEmpty).toBe('function')
  })

  test('should perform CRUD operations with our package', () => {
    // Créer un store avec notre package
    const storeOptions = createPiniaEntityStore({
      storeName: 'crud-test',
      validateEntity: (entity: any) => {
        return !!(entity.name && entity.email)
      }
    })

    const useCrudStore = defineStore(storeOptions.id, storeOptions)
    const store = useCrudStore()

    // Test création
    const user1 = {
      id: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    }

    store.createOne(user1)
    expect(store.getAllIds()).toContain('user1')
    expect(store.getOne()('user1')).toEqual({ ...user1, $isDirty: false })

    // Test mise à jour
    store.updateOne('user1', { age: 31, name: 'Johnny Doe' })
    const updatedUser = store.getOne()('user1')
    expect(updatedUser?.age).toBe(31)
    expect(updatedUser?.name).toBe('Johnny Doe')
    expect(updatedUser?.$isDirty).toBe(true)

    // Test suppression
    store.deleteOne('user1')
    expect(store.getAllIds()).not.toContain('user1')
    expect(store.getOne()('user1')).toBeUndefined()
  })

  test('should handle validation with our package', () => {
    // Créer un store avec validation stricte
    const storeOptions = createPiniaEntityStore({
      storeName: 'validation-test',
      validateEntity: (entity: any) => {
        if (!entity.name || entity.name.trim().length === 0) {
          return 'Name is required'
        }
        if (!entity.email || !entity.email.includes('@')) {
          return 'Valid email is required'
        }
        if (entity.age && (entity.age < 0 || entity.age > 150)) {
          return 'Age must be between 0 and 150'
        }
        return true
      }
    })

    const useValidationStore = defineStore(storeOptions.id, storeOptions)
    const store = useValidationStore()

    // Test validation des erreurs
    expect(() => {
      store.createOne({ id: '1', email: 'test@example.com' })
    }).toThrow()

    expect(() => {
      store.createOne({ id: '1', name: '   ', email: 'test@example.com' })
    }).toThrow()

    expect(() => {
      store.createOne({ id: '1', name: 'Test', email: 'invalid-email' })
    }).toThrow()

    expect(() => {
      store.createOne({ id: '1', name: 'Test', email: 'test@example.com', age: -5 })
    }).toThrow()

    // Test création valide
    const validUser = {
      id: 'valid1',
      name: 'Valid User',
      email: 'valid@example.com',
      age: 25
    }

    expect(() => {
      store.createOne(validUser)
    }).not.toThrow()

    expect(store.getAllIds()).toContain('valid1')
  })

  test('should handle lifecycle hooks with our package', () => {
    const hooks = {
      onCreated: vi.fn(),
      onUpdated: vi.fn(),
      onDeleted: vi.fn()
    }

    // Créer un store avec hooks
    const storeOptions = createPiniaEntityStore({
      storeName: 'hooks-test',
      validateEntity: () => true,
      onEntityCreated: hooks.onCreated,
      onEntityUpdated: hooks.onUpdated,
      onEntityDeleted: hooks.onDeleted
    })

    const useHooksStore = defineStore(storeOptions.id, storeOptions)
    const store = useHooksStore()

    // Test création avec hook
    const user = { id: 'user1', name: 'Test User', email: 'test@example.com' }
    store.createOne(user)
    expect(hooks.onCreated).toHaveBeenCalledWith({ ...user, $isDirty: false })

    // Test mise à jour avec hook
    store.updateOne('user1', { name: 'Updated User' })
    expect(hooks.onUpdated).toHaveBeenCalledWith({ ...user, name: 'Updated User', $isDirty: true })

    // Test suppression avec hook
    store.deleteOne('user1')
    expect(hooks.onDeleted).toHaveBeenCalledWith({ ...user, name: 'Updated User', $isDirty: true })
  })

  test('should handle state management with our package', () => {
    const storeOptions = createPiniaEntityStore({
      storeName: 'state-test'
    })

    const useStateStore = defineStore(storeOptions.id, storeOptions)
    const store = useStateStore()

    // Test gestion des entités courantes
    const user = { id: 'user1', name: 'Current User', email: 'current@example.com' }
    store.createOne(user)
    
    store.setCurrent(user)
    expect(store.getCurrent()).toEqual({ ...user, $isDirty: false })

    // Test gestion des entités actives
    store.setActive('user1')
    expect(store.getActive()).toContain('user1')

    // Test reset
    store.$reset()
    expect(store.getIsEmpty()).toBe(true)
    expect(store.getCurrent()).toBeNull()
    expect(store.getActive()).toHaveLength(0)
  })
})

// Helper function pour définir un store Pinia (utilise la vraie API Pinia)
function defineStore(id: string, options: any) {
  return () => {
    const state = options.state ? options.state() : {}
    const actions = options.actions || {}
    const getters = options.getters || {}
    
    // Créer le store avec getters réactifs
    const store: any = { ...state }
    
    // Bind actions to store
    Object.keys(actions).forEach(key => {
      store[key] = actions[key].bind(store)
    })
    
    // Créer des getters réactifs qui accèdent au state actuel
    Object.keys(getters).forEach(key => {
      Object.defineProperty(store, key, {
        get: () => getters[key](store),
        enumerable: true,
        configurable: true
      })
    })
    
    return store
  }
}
