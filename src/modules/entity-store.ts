import { defineNuxtModule } from '@nuxt/kit'
import createActions from '../createActions'
import createGetters from '../createGetters'
import createState from '../createState'

interface EntityStoreOptions {
  // add options here
}

export default defineNuxtModule<EntityStoreOptions>({
  meta: {
    name: 'entity-store',
    configKey: 'entityStore',
  },
  setup(options, nuxt) {
    // initialize the module
    nuxt.options.runtimeConfig.entityStore = options

    // expose the actions, getters and state
    nuxt.provide('entityStore', {
      createActions,
      createGetters,
      createState,
    })
  },
}) 
