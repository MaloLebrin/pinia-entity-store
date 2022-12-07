import { hasOwnProperty } from '@antfu/utils'
import createState from '../../src/createState'
import type { UserEntity } from '../store/Store'
import createGetters from '../../src/createGetters'

export const userState = defaultState()

export function defaultState() {
  return {
    ...createState<UserEntity>(),
  }
}

export function defaultTestInit() {
  const app = createApp({})
  const pinia = createPinia()
  app.use(pinia)
  pinia.use(({ store, options }) => {
    // console.log(options, `<==== options ${store.$id}`)
    // const { actions, state, getters } = options

    options.entityStoreOptions
    console.log(options.entityStoreOptions, `<==== options.entityStoreOptions ${store.$id}`)

    if (options.entityStoreOptions && options.entityStoreOptions.isEntityStore) {
      if (!hasOwnProperty(store.$state, 'entities')) {
        store.$state = defaultState()
        // console.log(store.$state, `<==== store ${store.$id}`)
      }
      store.entities = toRef(store.$state, 'entities')
    }
  })

  setActivePinia(pinia)
}
