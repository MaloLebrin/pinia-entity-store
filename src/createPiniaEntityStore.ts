import { createActions, createGetters, createState } from './'
import type { CreationParams, WithId } from '~/types'

export default function createPiniaEntityStore<T extends WithId>(args: CreationParams) {
  const { id, options } = args

  const entityStoreState = createState<T>()

  let state = {
    ...entityStoreState,
  }

  let getters = {
    ...createGetters<T>(state),
  }

  let actions = {
    ...createActions<T>(state),
  }

  if (options) {
    if (options.defaultState) {
      state = {
        ...state,
        ...options.defaultState,
      }
    }

    if (options.getters) {
      getters = {
        ...getters,
        ...options.getters,
      }
    }

    if (options.actions) {
      actions = {
        ...actions,
        ...options.actions,
      }
    }
  }

  return defineStore(id, {
    state: () => ({ ...state }),
    getters,
    actions,
  })
}
