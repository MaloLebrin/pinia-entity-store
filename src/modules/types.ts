import type { EntityStoreOptions, EntityStoreState } from './entity-store'
import type { UseEntityStoreOptions } from './runtime/composables/useEntityStore'

declare module '@nuxt/schema' {
  interface ConfigSchema {
    publicRuntimeConfig: {
      entityStore?: EntityStoreOptions['runtime']
    }
  }
}

declare module '#app' {
  interface NuxtApp {
    $entityStore: {
      createActions: <T extends { id: number }>(state: EntityStoreState<T>) => any
      createGetters: <T extends { id: number }>(state: EntityStoreState<T>) => any
      createState: <T extends { id: number }>() => EntityStoreState<T>
    }
  }
}

export type { EntityStoreOptions, EntityStoreState, UseEntityStoreOptions } 
