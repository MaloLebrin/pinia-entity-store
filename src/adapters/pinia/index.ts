import type { DefineStoreOptions } from 'pinia'
import { createActions, createGetters, createState } from '../../core'
import type { EntityStoreConfig, WithId } from '../../core/types'

export interface PiniaEntityStoreOptions<T extends WithId> extends EntityStoreConfig<T> {
  // Pinia-specific options
  storeName?: string
  persist?: boolean
  devtools?: boolean
}

/**
 * Create a Pinia store with entity management capabilities
 * @param options Store configuration options
 * @returns Pinia store options
 */
export function createPiniaEntityStore<T extends WithId>(
  options: PiniaEntityStoreOptions<T> = {}
): DefineStoreOptions<string, any, any, any> {
  const { storeName = 'entity', ...config } = options
  
  return {
    id: storeName,
    state: () => createState<T>(config),
    getters: {
      ...createGetters<T>(createState<T>(config)),
    },
    actions: {
      ...createActions<T>(createState<T>(config), config),
      
      // Pinia-specific methods
      resetState() {
        this.$reset()
      },
      
      // Override actions to work with Pinia's reactive state
      createOne(payload: T) {
        if (config?.validateEntity) {
          const validation = config.validateEntity(payload)
          if (typeof validation === 'string') {
            throw new Error(`Entity validation failed: ${validation}`)
          }
          if (!validation) {
            throw new Error('Entity validation failed')
          }
        }

        const entityWithDirty = { ...payload, $isDirty: false }
        if (!this.entities.byId[payload.id] && !this.entities.allIds.includes(payload.id)) {
          this.entities.allIds.push(payload.id)
        }
        this.entities.byId[payload.id] = entityWithDirty
        
        config?.onEntityCreated?.(payload)
      },

      updateOne(id: T['id'], payload: T) {
        if (this.entities.byId[id]) {
          const previousEntity = { ...this.entities.byId[id] }
          this.entities.byId[id] = {
            ...this.entities.byId[id],
            ...payload,
          }
          this.setIsDirty(id)
          
          config?.onEntityUpdated?.(payload, previousEntity)
        } else {
          this.createOne(payload)
        }
      },

      deleteOne(id: T['id']) {
        const entity = this.entities.byId[id]
        if (entity) {
          delete this.entities.byId[id]
          this.entities.allIds = this.entities.allIds.filter(entityId => entityId !== id)
          
          config?.onEntityDeleted?.(entity)
        }
      },

      setIsDirty(id: T['id']) {
        if (this.entities.byId[id]) {
          this.entities.byId[id] = {
            ...this.entities.byId[id],
            $isDirty: true,
          }
        }
      },

      setIsNotDirty(id: T['id']) {
        if (this.entities.byId[id]) {
          this.entities.byId[id] = {
            ...this.entities.byId[id],
            $isDirty: false,
          }
        }
      },

      updateField<K extends keyof T>(field: K, value: T[K], id: T['id']) {
        if (this.entities.byId[id]) {
          this.entities.byId[id][field] = value
          this.setIsDirty(id)
        }
      },
    },
  }
}

// Legacy compatibility functions
export function createState<T extends WithId>(config?: EntityStoreConfig<T>) {
  return createState<T>(config)
}

export function createActions<T extends WithId>(state: any, config?: EntityStoreConfig<T>) {
  return createActions<T>(state, config)
}

export function createGetters<T extends WithId>(state: any) {
  return createGetters<T>(state)
}
