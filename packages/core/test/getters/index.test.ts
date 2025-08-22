import { beforeEach, describe, expect, test } from 'vitest'
import { createUser, mockUsers } from '../fixtures/entities'

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

const createGetters = (state: any) => {
  return {
    getOne() {
      return (id: any) => state.entities.byId[id]
    },

    getMany() {
      return (ids: any[]) => ids.map(id => state.entities.byId[id]).filter(Boolean)
    },

    getAll() {
      return state.entities.byId
    },

    getAllArray() {
      return Object.values(state.entities.byId)
    },

    getAllIds() {
      return state.entities.allIds
    },

    getWhere() {
      return (filter: (entity: any) => boolean) => {
        const filtered: any = {}
        Object.values(state.entities.byId).forEach((entity: any) => {
          if (filter(entity)) {
            filtered[entity.id] = entity
          }
        })
        return filtered
      }
    },

    getWhereArray() {
      return (filter: (entity: any) => boolean) => {
        return Object.values(state.entities.byId).filter(filter)
      }
    },

    getFirstWhere() {
      return (filter: (entity: any) => boolean) => {
        return Object.values(state.entities.byId).find(filter)
      }
    },

    getIsEmpty() {
      return Object.keys(state.entities.byId).length === 0
    },

    getIsNotEmpty() {
      return Object.keys(state.entities.byId).length > 0
    },

    getMissingIds() {
      return (ids: any[]) => ids.filter(id => !state.entities.byId[id])
    },

    getMissingEntities() {
      return (entities: any[]) => entities.filter(entity => !state.entities.byId[entity.id])
    },

    getCurrent() {
      return state.entities.current
    },

    getActive() {
      return state.entities.active
    },

    getFirstActive() {
      return state.entities.active[0]
    },

    // Legacy compatibility
    findOneById() {
      return this.getOne()
    },

    findManyById() {
      return this.getMany()
    }
  }
}

describe('Core Getters', () => {
  let userState: any
  let productState: any
  let userGetters: any
  let productGetters: any

  beforeEach(() => {
    userState = createState()
    productState = createState()
    userGetters = createGetters(userState)
    productGetters = createGetters(productState)
  })

  describe('Basic Getters', () => {
    test('getOne should return entity by id', () => {
      const user = createUser()
      userState.entities.byId[user.id] = { ...user, $isDirty: false }
      userState.entities.allIds.push(user.id)

      const result = userGetters.getOne()(user.id)
      expect(result).toEqual({ ...user, $isDirty: false })
    })

    test('getMany should return multiple entities', () => {
      const users = mockUsers.slice(0, 2)
      users.forEach(user => {
        userState.entities.byId[user.id] = { ...user, $isDirty: false }
        userState.entities.allIds.push(user.id)
      })

      const result = userGetters.getMany()(users.map(u => u.id))
      expect(result).toHaveLength(2)
      expect(result[0]).toEqual({ ...users[0], $isDirty: false })
    })

    test('getAll should return all entities as record', () => {
      const users = mockUsers.slice(0, 2)
      users.forEach(user => {
        userState.entities.byId[user.id] = { ...user, $isDirty: false }
        userState.entities.allIds.push(user.id)
      })

      const result = userGetters.getAll()
      expect(Object.keys(result)).toHaveLength(2)
      expect(result[users[0].id]).toEqual({ ...users[0], $isDirty: false })
    })

    test('getAllArray should return all entities as array', () => {
      const users = mockUsers.slice(0, 2)
      users.forEach(user => {
        userState.entities.byId[user.id] = { ...user, $isDirty: false }
        userState.entities.allIds.push(user.id)
      })

      const result = userGetters.getAllArray()
      expect(result).toHaveLength(2)
      expect(result).toContainEqual({ ...users[0], $isDirty: false })
    })

    test('getAllIds should return all entity ids', () => {
      const users = mockUsers.slice(0, 2)
      users.forEach(user => {
        userState.entities.byId[user.id] = { ...user, $isDirty: false }
        userState.entities.allIds.push(user.id)
      })

      const result = userGetters.getAllIds()
      expect(result).toHaveLength(2)
      expect(result).toContain(users[0].id)
      expect(result).toContain(users[1].id)
    })
  })

  describe('Filtering Getters', () => {
    test('getWhere should filter entities', () => {
      const users = mockUsers
      users.forEach(user => {
        userState.entities.byId[user.id] = { ...user, $isDirty: false }
        userState.entities.allIds.push(user.id)
      })

      const activeUsers = userGetters.getWhere()(user => user.isActive)
      expect(Object.keys(activeUsers)).toHaveLength(2) // 2 active users
    })

    test('getWhereArray should return filtered entities as array', () => {
      const users = mockUsers
      users.forEach(user => {
        userState.entities.byId[user.id] = { ...user, $isDirty: false }
        userState.entities.allIds.push(user.id)
      })

      const activeUsers = userGetters.getWhereArray()(user => user.isActive)
      expect(activeUsers).toHaveLength(2)
      expect(activeUsers.every(user => user.isActive)).toBe(true)
    })

    test('getFirstWhere should return first matching entity', () => {
      const users = mockUsers
      users.forEach(user => {
        userState.entities.byId[user.id] = { ...user, $isDirty: false }
        userState.entities.allIds.push(user.id)
      })

      const firstActiveUser = userGetters.getFirstWhere()(user => user.isActive)
      expect(firstActiveUser?.isActive).toBe(true)
    })
  })

  describe('Utility Getters', () => {
    test('getIsEmpty should return true for empty state', () => {
      expect(userGetters.getIsEmpty()).toBe(true)
    })

    test('getIsNotEmpty should return false for empty state', () => {
      expect(userGetters.getIsNotEmpty()).toBe(false)
    })

    test('getIsEmpty should return false for non-empty state', () => {
      const user = createUser()
      userState.entities.byId[user.id] = { ...user, $isDirty: false }
      userState.entities.allIds.push(user.id)

      expect(userGetters.getIsEmpty()).toBe(false)
      expect(userGetters.getIsNotEmpty()).toBe(true)
    })

    test('getMissingIds should return missing ids', () => {
      const users = mockUsers.slice(0, 2)
      users.forEach(user => {
        userState.entities.byId[user.id] = { ...user, $isDirty: false }
        userState.entities.allIds.push(user.id)
      })

      const allIds = mockUsers.map(u => u.id)
      const missingIds = userGetters.getMissingIds()(allIds)
      expect(missingIds).toHaveLength(1)
      expect(missingIds).toContain(mockUsers[2].id)
    })

    test('getMissingEntities should return missing entities', () => {
      const users = mockUsers.slice(0, 2)
      users.forEach(user => {
        userState.entities.byId[user.id] = { ...user, $isDirty: false }
        userState.entities.allIds.push(user.id)
      })

      const missingEntities = userGetters.getMissingEntities()(mockUsers)
      expect(missingEntities).toHaveLength(1)
      expect(missingEntities[0]).toEqual(mockUsers[2])
    })
  })

  describe('Current and Active Getters', () => {
    test('getCurrent should return current entity', () => {
      const user = createUser()
      userState.entities.current = { ...user, $isDirty: false }

      const result = userGetters.getCurrent()
      expect(result).toEqual({ ...user, $isDirty: false })
    })

    test('getActive should return active entity ids', () => {
      const user = createUser()
      userState.entities.active.push(user.id)

      const result = userGetters.getActive()
      expect(result).toContain(user.id)
    })

    test('getFirstActive should return first active entity id', () => {
      const user = createUser()
      userState.entities.active.push(user.id)

      const result = userGetters.getFirstActive()
      expect(result).toBe(user.id)
    })
  })

  describe('Legacy Compatibility', () => {
    test('findOneById should work as getOne', () => {
      const user = createUser()
      userState.entities.byId[user.id] = { ...user, $isDirty: false }
      userState.entities.allIds.push(user.id)

      const result = userGetters.findOneById()(user.id)
      expect(result).toEqual({ ...user, $isDirty: false })
    })

    test('findManyById should work as getMany', () => {
      const users = mockUsers.slice(0, 2)
      users.forEach(user => {
        userState.entities.byId[user.id] = { ...user, $isDirty: false }
        userState.entities.allIds.push(user.id)
      })

      const result = userGetters.findManyById()(users.map(u => u.id))
      expect(result).toHaveLength(2)
    })
  })
})
