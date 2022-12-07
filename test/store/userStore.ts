import { defaultState, userState } from '../utils/baseState'
import { createActions, createGetters } from '../../src'
import type { UserEntity } from './Store'

export const useUserStore = defineStore('user', {
  state: () => ({ ...userState }),
  getters: {
    ...createGetters<UserEntity>(userState),
  },
  actions: {
    ...createActions<UserEntity>(userState),

    resetState() {
      this.$state = defaultState()
    },
  },
})

export default useUserStore
