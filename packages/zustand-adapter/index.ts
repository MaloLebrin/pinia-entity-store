import type { EntityStoreConfig, State, WithId } from '@malolebrin/entity-store-core'
import { createState } from '@malolebrin/entity-store-core'
import type { StateCreator } from 'zustand'

export interface ZustandEntityStoreOptions<T extends WithId> extends EntityStoreConfig<T> {
  // Zustand-specific options
  name?: string
  devtools?: boolean
  persist?: {
    name: string
    storage?: Storage
    partialize?: (state: State<T & { $isDirty: boolean }>) => Partial<State<T & { $isDirty: boolean }>>
  }
}

export interface ZustandEntityStore<T extends WithId> extends State<T & { $isDirty: boolean }> {
  // Actions
  createOne: (entity: T) => void
  createMany: (entities: T[]) => void
  updateOne: (id: T['id'], updates: Partial<T>) => void
  updateMany: (entities: T[]) => void
  deleteOne: (id: T['id']) => void
  deleteMany: (ids: T['id'][]) => void
  setCurrent: (entity: T) => void
  removeCurrent: () => void
  setCurrentById: (id: T['id']) => void
  removeCurrentById: () => void
  setActive: (id: T['id']) => void
  resetActive: () => void
  setIsDirty: (id: T['id']) => void
  setIsNotDirty: (id: T['id']) => void
  updateField: <K extends keyof T>(field: K, value: T[K], id: T['id']) => void
  
  // Getters
  getOne: (id: T['id']) => (T & { $isDirty: boolean }) | undefined
  getMany: (ids: T['id'][]) => (T & { $isDirty: boolean })[]
  getAll: () => Record<T['id'], T & { $isDirty: boolean }>
  getAllArray: () => (T & { $isDirty: boolean })[]
  getAllIds: () => T['id'][]
  getCurrent: () => (T & { $isDirty: boolean }) | null
  getCurrentById: () => (T & { $isDirty: boolean }) | null
  getActive: () => T['id'][]
  getFirstActive: () => T['id'] | undefined
  getWhere: (filter: (entity: T) => boolean) => Record<T['id'], T & { $isDirty: boolean }>
  getWhereArray: (filter: (entity: T) => boolean) => (T & { $isDirty: boolean })[]
  getFirstWhere: (filter: (entity: T) => boolean) => (T & { $isDirty: boolean }) | undefined
  getIsEmpty: () => boolean
  getIsNotEmpty: () => boolean
  getMissingIds: (ids: T['id'][], canHaveDuplicates?: boolean) => T['id'][]
  getMissingEntities: (entities: T[]) => T[]
  isAlreadyInStore: (id: T['id']) => boolean
  isAlreadyActive: (id: T['id']) => boolean
  isDirty: (id: T['id']) => boolean
  search: (field: string) => (T & { $isDirty: boolean })[]
  
  // Legacy compatibility
  findOneById: (id: T['id']) => (T & { $isDirty: boolean }) | undefined
  findManyById: (ids: T['id'][]) => (T & { $isDirty: boolean })[]
  
  // Utility methods
  reset: () => void
}

/**
 * Create a Zustand store with entity management capabilities
 * @param options Store configuration options
 * @returns Zustand store creator
 */
export function createZustandEntityStore<T extends WithId>(
  options: ZustandEntityStoreOptions<T> = {}
): StateCreator<ZustandEntityStore<T>, [], [], ZustandEntityStore<T>> {
  const { ...config } = options
  
  return (set, get): ZustandEntityStore<T> => {
    const initialState = createState<T>(config)
    
    return {
      ...initialState,
      
      // Actions
      createOne: payload => {
        if (config?.validateEntity) {
          const validation = config.validateEntity(payload)
          if (typeof validation === 'string') {
            throw new Error(`Entity validation failed: ${validation}`)
          }
          if (!validation) {
            throw new Error('Entity validation failed')
          }
        }

        set(state => {
          const entityWithDirty = { ...payload, $isDirty: false }
          const newState = { ...state }
          
          if (!newState.entities.byId[payload.id] && !newState.entities.allIds.includes(payload.id)) {
            newState.entities.allIds.push(payload.id)
          }
          newState.entities.byId[payload.id] = entityWithDirty
          
          config?.onEntityCreated?.(payload)
          return newState
        })
      },

      createMany: payload => {
        payload.forEach(entity => get().createOne(entity))
      },

      updateOne: (id: T['id'], updates: Partial<T>) => {
        set(state => {
          if (state.entities.byId[id]) {
            const previousEntity = { ...state.entities.byId[id] }
            const newState = { ...state }
            newState.entities.byId[id] = {
              ...newState.entities.byId[id],
              ...updates,
            }
            
            config?.onEntityUpdated?.(updates as T, previousEntity)
            return newState
          } else {
            get().createOne(updates as T)
            return state
          }
        })
      },

      updateMany: payload => {
        payload.forEach(entity => get().updateOne(entity.id, entity))
      },

      deleteOne: id => {
        set(state => {
          const entity = state.entities.byId[id]
          if (entity) {
            const newState = { ...state }
            delete newState.entities.byId[id]
            newState.entities.allIds = newState.entities.allIds.filter(entityId => entityId !== id)
            
            config?.onEntityDeleted?.(entity)
            return newState
          }
          return state
        })
      },

      deleteMany: ids => {
        ids.forEach(id => get().deleteOne(id))
      },

      setCurrent: payload => {
        set(state => ({
          ...state,
          entities: {
            ...state.entities,
            current: { ...payload, $isDirty: false }
          }
        }))
      },

      removeCurrent: () => {
        set(state => ({
          ...state,
          entities: {
            ...state.entities,
            current: null
          }
        }))
      },

      setCurrentById: id => {
        set(state => ({
          ...state,
          entities: {
            ...state.entities,
            currentById: id
          }
        }))
      },

      removeCurrentById: () => {
        set(state => ({
          ...state,
          entities: {
            ...state.entities,
            currentById: null
          }
        }))
      },

      setActive: id => {
        set(state => {
          if (!state.entities.active.includes(id)) {
            return {
              ...state,
              entities: {
                ...state.entities,
                active: [...state.entities.active, id]
              }
            }
          }
          return state
        })
      },

      resetActive: () => {
        set(state => ({
          ...state,
          entities: {
            ...state.entities,
            active: []
          }
        }))
      },

      setIsDirty: id => {
        set(state => {
          if (state.entities.byId[id]) {
            const newState = { ...state }
            newState.entities.byId[id] = {
              ...newState.entities.byId[id],
              $isDirty: true,
            }
            return newState
          }
          return state
        })
      },

      setIsNotDirty: id => {
        set(state => {
          if (state.entities.byId[id]) {
            const newState = { ...state }
            newState.entities.byId[id] = {
              ...newState.entities.byId[id],
              $isDirty: false,
            }
            return newState
          }
          return state
        })
      },

      updateField: <K extends keyof T>(field: K, value: T[K], id: T['id']) => {
        set(state => {
          if (state.entities.byId[id]) {
            const newState = { ...state }
            const entity = newState.entities.byId[id]
            entity[field] = value as any
            return newState
          }
          return state
        })
      },

      // Getters (computed from current state)
      getOne: id => get().entities.byId[id],
      getMany: ids => ids.map(id => get().entities.byId[id]).filter(Boolean),
      getAll: () => get().entities.byId,
      getAllArray: () => Object.values(get().entities.byId),
      getAllIds: () => get().entities.allIds,
      getCurrent: () => get().entities.current,
      getCurrentById: () => {
        const state = get()
        return state.entities.currentById ? state.entities.byId[state.entities.currentById] : null
      },
      getActive: () => get().entities.active,
      getFirstActive: () => get().entities.active[0],
      getWhere: filter => {
        const state = get()
        return state.entities.allIds.reduce((acc: Record<T['id'], T & { $isDirty: boolean }>, id: T['id']) => {
          const item = state.entities.byId[id]
          if (!filter(item)) return acc
          acc[id] = item
          return acc
        }, {} as Record<T['id'], T & { $isDirty: boolean }>)
      },
      getWhereArray: filter => {
        const state = get()
        return Object.values(state.entities.allIds.reduce((acc: Record<T['id'], T & { $isDirty: boolean }>, id: T['id']) => {
          const item = state.entities.byId[id]
          if (!filter(item)) return acc
          acc[id] = item
          return acc
        }, {} as Record<T['id'], T & { $isDirty: boolean }>))
      },
      getFirstWhere: filter => {
        const state = get()
        const filtered = state.entities.allIds.reduce((acc: Record<T['id'], T & { $isDirty: boolean }>, id: T['id']) => {
          const item = state.entities.byId[id]
          if (!filter(item)) return acc
          acc[id] = item
          return acc
        }, {} as Record<T['id'], T & { $isDirty: boolean }>)
        return Object.values(filtered)[0] as (T & { $isDirty: boolean }) | undefined
      },
      getIsEmpty: () => get().entities.allIds.length === 0,
      getIsNotEmpty: () => get().entities.allIds.length > 0,
      getMissingIds: (ids: T['id'][], canHaveDuplicates = false) => {
        const state = get()
        const filteredIds = ids.filter(id => !state.entities.allIds.includes(id))
        return canHaveDuplicates ? filteredIds : [...new Set(filteredIds)]
      },
      getMissingEntities: entities => {
        const state = get()
        return entities?.length > 0 ? entities.filter(entity => !state.entities.allIds.includes(entity.id)) : []
      },
      isAlreadyInStore: id => get().entities.allIds.includes(id),
      isAlreadyActive: id => get().entities.active.includes(id),
      isDirty: id => get().entities.byId[id]?.$isDirty ?? false,
      search: field => {
        const state = get()
        return Object.values(state.entities.byId).filter(item => {
          const regex = new RegExp(field, 'i')
          for (const value of Object.values(item)) {
            if (typeof value === 'string' && regex.test(value)) {
              return true
            }
          }
          return false
        })
      },

      // Legacy compatibility
      findOneById: id => get().entities.byId[id],
      findManyById: ids => ids.map(id => get().entities.byId[id]).filter(Boolean),

      // Utility methods
      reset: () => set(initialState),
    }
  }
}
