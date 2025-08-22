import { beforeEach, describe, expect, test, vi } from 'vitest'
import { createUser } from '../../fixtures/entities'

// Mock functions for testing
const createState = () => ({
  entities: {
    byId: {},
    allIds: [],
    current: null,
    currentById: null,
    active: []
  }
})

const createActions = (state: any, config?: any) => {
  return {
    createOne(payload: any) {
      if (config?.validateEntity && !config.validateEntity(payload)) {
        throw new Error('Entity validation failed')
      }
      const entityWithDirty = { ...payload, $isDirty: false }
      state.entities.byId[payload.id] = entityWithDirty
      if (!state.entities.allIds.includes(payload.id)) {
        state.entities.allIds.push(payload.id)
      }
      config?.onEntityCreated?.(payload)
    },

    createMany(entities: any[]) {
      entities.forEach(entity => this.createOne(entity))
    },

    updateOne(id: any, payload: any) {
      if (state.entities.byId[id]) {
        const previousEntity = { ...state.entities.byId[id] }
        state.entities.byId[id] = { ...state.entities.byId[id], ...payload }
        this.setIsDirty(id)
        config?.onEntityUpdated?.(payload, previousEntity)
      } else {
        this.createOne(payload)
      }
    },

    deleteOne(id: any) {
      const entity = state.entities.byId[id]
      if (entity) {
        delete state.entities.byId[id]
        state.entities.allIds = state.entities.allIds.filter((entityId: any) => entityId !== id)
        config?.onEntityDeleted?.(entity)
      }
    },

    setCurrent(entity: any) {
      state.entities.current = { ...entity, $isDirty: false }
    },

    setActive(id: any) {
      if (!state.entities.active.includes(id)) {
        state.entities.active.push(id)
      }
    },

    setIsDirty(id: any) {
      if (state.entities.byId[id]) {
        state.entities.byId[id].$isDirty = true
      }
    },

    updateField(field: string, value: any, id: any) {
      if (state.entities.byId[id]) {
        state.entities.byId[id][field] = value
        this.setIsDirty(id)
      }
    }
  }
}

describe('Core Actions', () => {
  let userState: any
  let productState: any
  let userActions: any
  let productActions: any

  beforeEach(() => {
    userState = createState()
    productState = createState()
    userActions = createActions(userState)
    productActions = createActions(productState)
  })

  describe('createOne', () => {
    test('should create entity with dirty flag', () => {
      const user = createUser()
      userActions.createOne(user)

      expect(userState.entities.byId[user.id]).toBeDefined()
      expect(userState.entities.byId[user.id].$isDirty).toBe(false)
      expect(userState.entities.allIds).toContain(user.id)
    })

    test('should call validation hook when provided', () => {
      const validateSpy = vi.fn((user: any) => user.email.includes('@'))
      const config = { validateEntity: validateSpy }
      const actions = createActions(userState, config)
      
      const validUser = createUser({ email: 'valid@email.com' })
      const invalidUser = createUser({ email: 'invalid-email' })

      actions.createOne(validUser)
      expect(validateSpy).toHaveBeenCalledWith(validUser)

      expect(() => actions.createOne(invalidUser)).toThrow('Entity validation failed')
    })

    test('should call onEntityCreated hook when provided', () => {
      const onCreatedSpy = vi.fn()
      const config = { onEntityCreated: onCreatedSpy }
      const actions = createActions(userState, config)
      
      const user = createUser()
      actions.createOne(user)

      expect(onCreatedSpy).toHaveBeenCalledWith(user)
    })
  })

  describe('createMany', () => {
    test('should create multiple entities', () => {
      const users = [createUser(), createUser(), createUser()]
      userActions.createMany(users)

      users.forEach(user => {
        expect(userState.entities.byId[user.id]).toBeDefined()
        expect(userState.entities.allIds).toContain(user.id)
      })
    })
  })

  describe('updateOne', () => {
    test('should update existing entity', () => {
      const user = createUser()
      userActions.createOne(user)
      
      const updates = { name: 'Updated Name', age: 31 }
      userActions.updateOne(user.id, updates)

      expect(userState.entities.byId[user.id].name).toBe('Updated Name')
      expect(userState.entities.byId[user.id].age).toBe(31)
      expect(userState.entities.byId[user.id].$isDirty).toBe(true)
    })

    test('should create entity if it does not exist', () => {
      const user = createUser()
      userActions.updateOne(user.id, user)

      expect(userState.entities.byId[user.id]).toBeDefined()
      expect(userState.entities.allIds).toContain(user.id)
    })

    test('should call onEntityUpdated hook when provided', () => {
      const onUpdatedSpy = vi.fn()
      const config = { onEntityUpdated: onUpdatedSpy }
      const actions = createActions(userState, config)
      
      const user = createUser()
      actions.createOne(user)
      
      const updates = { name: 'Updated Name' }
      actions.updateOne(user.id, updates)

      expect(onUpdatedSpy).toHaveBeenCalledWith(updates, user)
    })
  })

  describe('deleteOne', () => {
    test('should delete existing entity', () => {
      const user = createUser()
      userActions.createOne(user)
      userActions.deleteOne(user.id)

      expect(userState.entities.byId[user.id]).toBeUndefined()
      expect(userState.entities.allIds).not.toContain(user.id)
    })

    test('should call onEntityDeleted hook when provided', () => {
      const onDeletedSpy = vi.fn()
      const config = { onEntityDeleted: onDeletedSpy }
      const actions = createActions(userState, config)
      
      const user = createUser()
      actions.createOne(user)
      actions.deleteOne(user.id)

      expect(onDeletedSpy).toHaveBeenCalledWith(user)
    })
  })

  describe('setCurrent', () => {
    test('should set current entity', () => {
      const user = createUser()
      userActions.setCurrent(user)

      expect(userState.entities.current).toEqual({ ...user, $isDirty: false })
    })
  })

  describe('setActive', () => {
    test('should add entity to active list', () => {
      const user = createUser()
      userActions.setActive(user.id)

      expect(userState.entities.active).toContain(user.id)
    })

    test('should not duplicate active entities', () => {
      const user = createUser()
      userActions.setActive(user.id)
      userActions.setActive(user.id)

      expect(userState.entities.active).toHaveLength(1)
      expect(userState.entities.active).toContain(user.id)
    })
  })

  describe('setIsDirty', () => {
    test('should set entity as dirty', () => {
      const user = createUser()
      userActions.createOne(user)
      userActions.setIsDirty(user.id)

      expect(userState.entities.byId[user.id].$isDirty).toBe(true)
    })
  })

  describe('updateField', () => {
    test('should update specific field', () => {
      const user = createUser()
      userActions.createOne(user)
      userActions.updateField('name', 'New Name', user.id)

      expect(userState.entities.byId[user.id].name).toBe('New Name')
      expect(userState.entities.byId[user.id].$isDirty).toBe(true)
    })
  })
})
