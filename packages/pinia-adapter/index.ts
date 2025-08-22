import type { EntityStoreConfig, WithId } from '@malolebrin/entity-store-core'
import { createActions as createCoreActions, createGetters as createCoreGetters, createState as createCoreState } from '@malolebrin/entity-store-core'
import type { DefineStoreOptions } from 'pinia'

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
    state: () => createCoreState<T>(),
    getters: {
      ...createCoreGetters<T>(createCoreState<T>()),
    },
    actions: {
      ...createCoreActions<T>(createCoreState<T>(), config),
      
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
          this.entities.allIds = this.entities.allIds.filter((entityId: T['id']) => entityId !== id)
          
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
export function createState<T extends WithId>() {
  return createCoreState<T>()
}

export function createActions<T extends WithId>(state: any, config?: EntityStoreConfig<T>) {
  return createCoreActions<T>(state, config)
}

export function createGetters<T extends WithId>(state: any) {
  return createCoreGetters<T>(state)
}
