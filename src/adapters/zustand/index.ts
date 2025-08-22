import type { StateCreator } from 'zustand'
import { createActions, createGetters, createState } from '../../core'
import type { EntityStoreConfig, State, WithId } from '../../core/types'

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
  const { name = 'entity-store', ...config } = options
  
  return (set, get, store) => {
    const initialState = createState<T>(config)
    const actions = createActions<T>(initialState, config)
    const getters = createGetters<T>(initialState)
    
    return {
      ...initialState,
      
      // Actions
      createOne: (payload: T) => {
        if (config?.validateEntity) {
          const validation = config.validateEntity(payload)
          if (typeof validation === 'string') {
            throw new Error(`Entity validation failed: ${validation}`)
          }
          if (!validation) {
            throw new Error('Entity validation failed')
          }
        }

        set((state) => {
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

      createMany: (payload: T[]) => {
        payload.forEach(entity => get().createOne(entity))
      },

      updateOne: (id: T['id'], payload: T) => {
        set((state) => {
          if (state.entities.byId[id]) {
            const previousEntity = { ...state.entities.byId[id] }
            const newState = { ...state }
            newState.entities.byId[id] = {
              ...newState.entities.byId[id],
              ...payload,
            }
            
            config?.onEntityUpdated?.(payload, previousEntity)
            return newState
          } else {
            get().createOne(payload)
            return state
          }
        })
      },

      updateMany: (payload: T[]) => {
        payload.forEach(entity => get().updateOne(entity.id, entity))
      },

      deleteOne: (id: T['id']) => {
        set((state) => {
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

      deleteMany: (ids: T['id'][]) => {
        ids.forEach(id => get().deleteOne(id))
      },

      setCurrent: (payload: T) => {
        set((state) => ({
          ...state,
          entities: {
            ...state.entities,
            current: { ...payload, $isDirty: false }
          }
        }))
      },

      removeCurrent: () => {
        set((state) => ({
          ...state,
          entities: {
            ...state.entities,
            current: null
          }
        }))
      },

      setCurrentById: (id: T['id']) => {
        set((state) => ({
          ...state,
          entities: {
            ...state.entities,
            currentById: id
          }
        }))
      },

      removeCurrentById: () => {
        set((state) => ({
          ...state,
          entities: {
            ...state.entities,
            currentById: null
          }
        }))
      },

      setActive: (id: T['id']) => {
        set((state) => {
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
        set((state) => ({
          ...state,
          entities: {
            ...state.entities,
            active: []
          }
        }))
      },

      setIsDirty: (id: T['id']) => {
        set((state) => {
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

      setIsNotDirty: (id: T['id']) => {
        set((state) => {
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
        set((state) => {
          if (state.entities.byId[id]) {
            const newState = { ...state }
            newState.entities.byId[id][field] = value
            return newState
          }
          return state
        })
      },

      // Getters (computed from current state)
      getOne: (id: T['id']) => get().entities.byId[id],
      getMany: (ids: T['id'][]) => ids.map(id => get().entities.byId[id]).filter(Boolean),
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
      getWhere: (filter: (entity: T) => boolean) => {
        const state = get()
        return state.entities.allIds.reduce((acc: Record<T['id'], T & { $isDirty: boolean }>, id: T['id']) => {
          const item = state.entities.byId[id]
          if (!filter(item)) return acc
          acc[id] = item
          return acc
        }, {} as Record<T['id'], T & { $isDirty: boolean }>)
      },
      getWhereArray: (filter: (entity: T) => boolean) => {
        const state = get()
        return Object.values(state.entities.allIds.reduce((acc: Record<T['id'], T & { $isDirty: boolean }>, id: T['id']) => {
          const item = state.entities.byId[id]
          if (!filter(item)) return acc
          acc[id] = item
          return acc
        }, {} as Record<T['id'], T & { $isDirty: boolean }>))
      },
      getFirstWhere: (filter: (entity: T) => boolean) => {
        const state = get()
        return Object.values(state.entities.allIds.reduce((acc: Record<T['id'], T & { $isDirty: boolean }>, id: T['id']) => {
          const item = state.entities.byId[id]
          if (!filter(item)) return acc
          acc[id] = item
          return acc
        }, {} as Record<T['id'], T & { $isDirty: boolean }>))[0]
      },
      getIsEmpty: () => get().entities.allIds.length === 0,
      getIsNotEmpty: () => get().entities.allIds.length > 0,
      getMissingIds: (ids: T['id'][], canHaveDuplicates = false) => {
        const state = get()
        const filteredIds = ids.filter(id => !state.entities.allIds.includes(id))
        return canHaveDuplicates ? filteredIds : [...new Set(filteredIds)]
      },
      getMissingEntities: (entities: T[]) => {
        const state = get()
        return entities?.length > 0 ? entities.filter(entity => !state.entities.allIds.includes(entity.id)) : []
      },
      isAlreadyInStore: (id: T['id']) => get().entities.allIds.includes(id),
      isAlreadyActive: (id: T['id']) => get().entities.active.includes(id),
      isDirty: (id: T['id']) => get().entities.byId[id]?.$isDirty ?? false,
      search: (field: string) => {
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
      findOneById: (id: T['id']) => get().entities.byId[id],
      findManyById: (ids: T['id'][]) => ids.map(id => get().entities.byId[id]).filter(Boolean),

      // Utility methods
      reset: () => set(initialState),
    }
  }
}
