import { defaultState, userState } from '../utils/baseState'
import { createActions, createGetters } from '../../src'
import type { UserEntity } from './Store'

export const useUserStore = defineStore('user', {
  state: () => ({}),
  getters: {
    ...createGetters<UserEntity>(userState),
  },
  actions: {
    ...createActions<UserEntity>(userState),

    resetState() {
      this.$state = defaultState()
    },
  },
  entityStoreOptions: {
    isEntityStore: true,
  },
})

export default useUserStore
