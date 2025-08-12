import { addImportsDir, addTemplate, createResolver, defineNuxtModule } from '@nuxt/kit'
import createActions from '../createActions'
import createGetters from '../createGetters'
import createState from '../createState'

export interface EntityStoreOptions {
  /**
   * Enable auto-imports for entity store composables
   * @default true
   */
  autoImports?: boolean

  /**
   * Default configuration for entity stores
   */
  defaults?: {
    /**
     * Enable persistence for all stores by default
     * @default false
     */
    enablePersistence?: boolean
    
    /**
     * Storage key prefix for persisted stores
     * @default 'entity-store'
     */
    persistenceKeyPrefix?: string
  }

  /**
   * Runtime configuration
   */
  runtime?: {
    /**
     * Enable debug mode
     * @default false
     */
    debug?: boolean
  }
}

export interface EntityStoreState<T> {
  entities: {
    byId: Record<number, T>
    allIds: number[]
    current: T | null
    currentById: Record<number, T>
    active: number[]
  }
}

export default defineNuxtModule<EntityStoreOptions>({
  meta: {
    name: '@malolebrin/pinia-entity-store',
    configKey: 'entityStore',
    compatibility: {
      nuxt: '^3.0.0',
      bridge: false
    }
  },
  defaults: {
    autoImports: true,
    defaults: {
      enablePersistence: false,
      persistenceKeyPrefix: 'entity-store'
    },
    runtime: {
      debug: false
    }
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    const runtimeDir = resolve('./runtime')

    // Add runtime configuration
    nuxt.options.runtimeConfig.public.entityStore = {
      ...options.runtime
    }

    // Add composables auto-imports if enabled
    if (options.autoImports) {
      const composablesDir = resolve(runtimeDir, 'composables')
      addImportsDir(composablesDir)
    }

    // Add types
    addTemplate({
      filename: 'types/pinia-entity-store.d.ts',
      getContents: () => `
        declare module '#pinia-entity-store' {
          export interface EntityStoreOptions ${JSON.stringify(options)}
          export * from '${resolve('./types')}'
        }
      `
    })

    // Expose the core functionality
    nuxt.provide('entityStore', {
      createActions,
      createGetters,
      createState,
    })

    // Add plugin for store initialization
    addTemplate({
      filename: 'pinia-entity-store.plugin.ts',
      getContents: () => `
        import { defineNuxtPlugin } from '#app'
        import { createPinia } from 'pinia'
        
        export default defineNuxtPlugin((nuxtApp) => {
          const pinia = createPinia()
          nuxtApp.vueApp.use(pinia)
          
          if (process.dev && ${options.runtime?.debug}) {
            console.log('🏪 Pinia Entity Store initialized with options:', ${JSON.stringify(options)})
          }
        })
      `
    })
  }
}) 
