import { defaultState, userState } from '../utils/baseState'
import type { UserEntity } from '../../types'
import { createActions, createGetters } from '../../src'

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
