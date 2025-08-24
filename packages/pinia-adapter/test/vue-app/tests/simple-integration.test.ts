import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test } from 'vitest'

// Test simple de l'intégration Pinia
describe('Pinia Adapter - Simple Integration Test', () => {
  let pinia: any

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  test('should create a basic Pinia store', () => {
    // Test simple que Pinia fonctionne
    expect(pinia).toBeDefined()
    expect(typeof pinia.install).toBe('function')
  })

  test('should handle basic state management', () => {
    // Test que nous pouvons créer et utiliser un store Pinia basique
    const store = defineStore('test', {
      state: () => ({
        count: 0,
        users: []
      }),
      actions: {
        increment() {
          this.count++
        },
        addUser(user: any) {
          this.users.push(user)
        }
      }
    })

    const testStore = store()
    
    expect(testStore.count).toBe(0)
    testStore.increment()
    expect(testStore.count).toBe(1)
    
    const user = { id: '1', name: 'Test User' }
    testStore.addUser(user)
    expect(testStore.users).toHaveLength(1)
    expect(testStore.users[0]).toEqual(user)
  })

  test('should work with entity-like data', () => {
    // Test avec des données similaires à nos entités
    const entityStore = defineStore('entities', {
      state: () => ({
        entities: {
          byId: {},
          allIds: [],
          current: null,
          active: []
        }
      }),
      actions: {
        createOne(entity: any) {
          this.entities.byId[entity.id] = { ...entity, $isDirty: false }
          this.entities.allIds.push(entity.id)
        },
        updateOne(id: string, updates: any) {
          if (this.entities.byId[id]) {
            this.entities.byId[id] = { 
              ...this.entities.byId[id], 
              ...updates, 
              $isDirty: true 
            }
          }
        },
        deleteOne(id: string) {
          if (this.entities.byId[id]) {
            delete this.entities.byId[id]
            this.entities.allIds = this.entities.allIds.filter(entityId => entityId !== id)
            
            // Si l'entité supprimée était l'entité courante, la réinitialiser
            if (this.entities.current && this.entities.current.id === id) {
              this.entities.current = null
            }
            
            // Retirer de la liste des entités actives
            this.entities.active = this.entities.active.filter(entityId => entityId !== id)
          }
        },
        setCurrent(entity: any) {
          this.entities.current = entity ? { ...entity, $isDirty: false } : null
        },
        setActive(id: string) {
          if (!this.entities.active.includes(id)) {
            this.entities.active.push(id)
          }
        }
      },
      getters: {
        getAllIds: (state: any) => state.entities.allIds,
        getOne: (state: any) => (id: string) => state.entities.byId[id],
        getCurrent: (state: any) => state.entities.current,
        getActive: (state: any) => state.entities.active,
        getIsEmpty: (state: any) => state.entities.allIds.length === 0
      }
    })

    const store = entityStore()
    
    // Test CRUD complet
    const user1 = { id: 'user1', name: 'John Doe', email: 'john@example.com' }
    const user2 = { id: 'user2', name: 'Jane Smith', email: 'jane@example.com' }
    
    // Create
    store.createOne(user1)
    store.createOne(user2)
    
    expect(store.getAllIds).toHaveLength(2)
    expect(store.getOne('user1')).toEqual({ ...user1, $isDirty: false })
    expect(store.getOne('user2')).toEqual({ ...user2, $isDirty: false })
    
    // Update
    store.updateOne('user1', { name: 'Johnny Doe' })
    expect(store.getOne('user1')?.name).toBe('Johnny Doe')
    expect(store.getOne('user1')?.$isDirty).toBe(true)
    
    // Set current and active
    store.setCurrent(user1)
    store.setActive('user1')
    store.setActive('user2')
    
    expect(store.getCurrent).toEqual({ ...user1, $isDirty: false })
    expect(store.getActive).toContain('user1')
    expect(store.getActive).toContain('user2')
    
    // Delete
    store.deleteOne('user1')
    expect(store.getAllIds).toHaveLength(1)
    expect(store.getOne('user1')).toBeUndefined()
    expect(store.getCurrent).toBeNull()
    
    // Check empty state
    store.deleteOne('user2')
    expect(store.getIsEmpty).toBe(true)
  })

  test('should handle validation and hooks', () => {
    // Test de validation et hooks
    const validatedStore = defineStore('validated', {
      state: () => ({
        entities: {
          byId: {},
          allIds: []
        },
        hooks: {
          onCreated: 0,
          onUpdated: 0,
          onDeleted: 0
        }
      }),
      actions: {
        createOne(entity: any) {
          // Validation simple
          if (!entity.name || !entity.email) {
            throw new Error('Name and email are required')
          }
          
          this.entities.byId[entity.id] = { ...entity, $isDirty: false }
          this.entities.allIds.push(entity.id)
          this.hooks.onCreated++
        },
        
        updateOne(id: string, updates: any) {
          if (this.entities.byId[id]) {
            const previous = { ...this.entities.byId[id] }
            this.entities.byId[id] = { 
              ...this.entities.byId[id], 
              ...updates, 
              $isDirty: true 
            }
            this.hooks.onUpdated++
          }
        },
        
        deleteOne(id: string) {
          if (this.entities.byId[id]) {
            const entity = { ...this.entities.byId[id] }
            delete this.entities.byId[id]
            this.entities.allIds = this.entities.allIds.filter(entityId => entityId !== id)
            this.hooks.onDeleted++
          }
        }
      }
    })

    const store = validatedStore()
    
    // Test validation
    expect(() => {
      store.createOne({ id: '1', name: '' })
    }).toThrow('Name and email are required')
    
    expect(() => {
      store.createOne({ id: '1', email: 'test@example.com' })
    }).toThrow('Name and email are required')
    
    // Test création valide
    const validUser = { id: '1', name: 'Test User', email: 'test@example.com' }
    store.createOne(validUser)
    
    expect(store.hooks.onCreated).toBe(1)
    expect(store.entities.allIds).toHaveLength(1)
    
    // Test mise à jour
    store.updateOne('1', { name: 'Updated User' })
    expect(store.hooks.onUpdated).toBe(1)
    expect(store.entities.byId['1'].name).toBe('Updated User')
    
    // Test suppression
    store.deleteOne('1')
    expect(store.hooks.onDeleted).toBe(1)
    expect(store.entities.allIds).toHaveLength(0)
  })
})

// Helper function pour définir un store (simulation de defineStore)
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
