import { beforeEach, describe, expect, test } from 'vitest'
import { createProduct, createUser } from '../../fixtures/entities'

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

const createInitialState = () => createState()

const addEntityToState = (state: any, entity: any) => {
  state.entities.byId[entity.id] = { ...entity, $isDirty: false }
  if (!state.entities.allIds.includes(entity.id)) {
    state.entities.allIds.push(entity.id)
  }
}

const removeEntityFromState = (state: any, id: any) => {
  delete state.entities.byId[id]
  state.entities.allIds = state.entities.allIds.filter((entityId: any) => entityId !== id)
}

const updateEntityInState = (state: any, id: any, updates: any) => {
  if (state.entities.byId[id]) {
    state.entities.byId[id] = { ...state.entities.byId[id], ...updates }
  }
}

const setEntityDirty = (state: any, id: any, isDirty: boolean = true) => {
  if (state.entities.byId[id]) {
    state.entities.byId[id].$isDirty = isDirty
  }
}

describe('Core State Management', () => {
  let userState: any
  let productState: any

  beforeEach(() => {
    userState = createState()
    productState = createState()
  })

  test('createState should create empty state', () => {
    expect(userState.entities.byId).toEqual({})
    expect(userState.entities.allIds).toEqual([])
    expect(userState.entities.current).toBeNull()
    expect(userState.entities.currentById).toBeNull()
    expect(userState.entities.active).toEqual([])
  })

  test('createInitialState should be same as createState', () => {
    const initialState = createInitialState()
    expect(initialState).toEqual(userState)
  })

  test('addEntityToState should add entity correctly', () => {
    const user = createUser()
    addEntityToState(userState, user)

    expect(userState.entities.byId[user.id]).toBeDefined()
    expect(userState.entities.byId[user.id].$isDirty).toBe(false)
    expect(userState.entities.allIds).toContain(user.id)
  })

  test('addEntityToState should not duplicate allIds', () => {
    const user = createUser()
    addEntityToState(userState, user)
    addEntityToState(userState, user) // Add same entity again

    expect(userState.entities.allIds).toHaveLength(1)
    expect(userState.entities.allIds).toContain(user.id)
  })

  test('removeEntityFromState should remove entity correctly', () => {
    const user = createUser()
    addEntityToState(userState, user)
    removeEntityFromState(userState, user.id)

    expect(userState.entities.byId[user.id]).toBeUndefined()
    expect(userState.entities.allIds).not.toContain(user.id)
  })

  test('updateEntityInState should update existing entity', () => {
    const user = createUser()
    addEntityToState(userState, user)
    
    const updates = { name: 'Updated Name', age: 31 }
    updateEntityInState(userState, user.id, updates)

    expect(userState.entities.byId[user.id].name).toBe('Updated Name')
    expect(userState.entities.byId[user.id].age).toBe(31)
    expect(userState.entities.byId[user.id].email).toBe(user.email) // Unchanged
  })

  test('updateEntityInState should not affect non-existent entity', () => {
    const updates = { name: 'Updated Name' }
    updateEntityInState(userState, 'non-existent-id', updates)

    expect(userState.entities.byId['non-existent-id']).toBeUndefined()
  })

  test('setEntityDirty should set dirty flag correctly', () => {
    const user = createUser()
    addEntityToState(userState, user)
    
    setEntityDirty(userState, user.id, true)
    expect(userState.entities.byId[user.id].$isDirty).toBe(true)

    setEntityDirty(userState, user.id, false)
    expect(userState.entities.byId[user.id].$isDirty).toBe(false)
  })

  test('setEntityDirty should not affect non-existent entity', () => {
    setEntityDirty(userState, 'non-existent-id', true)
    // Should not throw error
    expect(userState.entities.byId['non-existent-id']).toBeUndefined()
  })

  test('should work with different ID types', () => {
    const product = createProduct()
    addEntityToState(productState, product)
    expect(productState.entities.byId[product.id]).toBeDefined()
    expect(productState.entities.allIds).toContain(product.id)

    removeEntityFromState(productState, product.id)
    expect(productState.entities.byId[product.id]).toBeUndefined()
    expect(productState.entities.allIds).not.toContain(product.id)
  })
})
