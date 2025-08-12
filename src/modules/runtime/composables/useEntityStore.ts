import { type DefineStoreOptions, defineStore } from 'pinia'
import type { EntityStoreState } from '../../entity-store'
import createState from '~/src/createState'
import createGetters from '~/src/createGetters'
import createActions from '~/src/createActions'


export interface UseEntityStoreOptions<T> extends Partial<DefineStoreOptions<string, EntityStoreState<T>, {}, {}>> { // Added missing type arguments
  /**
   * Store identifier
   */
  id: string

  /**
   * Enable persistence for this store
   * @default false
   */
  enablePersistence?: boolean

  /**
   * Custom persistence key
   * If not provided, will use the store id
   */
  persistenceKey?: string
}

/**
 * Create a typed entity store with all the default functionality
 * @param options Store configuration options
 * @returns A configured Pinia store with entity management capabilities
 */
export function useEntityStore<T extends { id: number }>(options: UseEntityStoreOptions<T>) {
  const {
    id,
    state: customState,
    getters: customGetters,
    actions: customActions,
    ...storeOptions
  } = options

  return defineStore(id, {
    state: () => ({
      ...createState<T>(),
      ...(typeof customState === 'function' ? customState() : customState || {})
    }),
    getters: {
      ...createGetters<T>(customState),
      ...customGetters
    },
    actions: {
      ...createActions<T>(customState),
      ...customActions
    },
    ...storeOptions
  })
}

// Type helper
export type EntityStore<T> = ReturnType<typeof useEntityStore<T>> 
