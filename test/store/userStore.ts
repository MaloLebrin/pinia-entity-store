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

    // createOne(payload: UserEntity): void {
    //   this.entities.byId[payload.id] = payload
    //   this.entities.allIds.push(payload.id)
    // },
    // createMany(payload: UserEntity[]) {
    //   payload.forEach(entity => this.createOne(entity))
    // },
    // setCurrent(payload: UserEntity) {
    //   this.entities.current = payload
    // },
    // removeCurrent() {
    //   this.entities.current = null
    // },
    // updateOne(id: number, payload: UserEntity): void {
    //   if (this.isAlreadyInStore(id)) {
    //     const entity = this.entities.byId[id]
    //     this.entities.byId[id] = {
    //       ...entity,
    //       ...payload,
    //     }
    //   }
    //   else {
    //     this.createOne(payload)
    //   }
    // },
    // updateMany(payload: UserEntity[]): void {
    //   payload.forEach(entity => this.updateOne(entity.id, entity))
    // },
    // deleteOne(id: number) {
    //   delete this.entities.byId[id]
    //   this.entities.allIds = this.entities.allIds.filter(entityId => entityId !== id)
    // },
    // deleteMany(ids: number[]) {
    //   ids.forEach(id => this.deleteOne(id))
    // },
    // setActive(id: number) {
    //   if (!this.isAlreadyActive(id))
    //     this.entities.active.push(id)
    // },
    // resetActive() {
    //   this.entities.active = []
    // },

    // resetState() {
    //   this.$state = defaultUserState()
    // },
  },
})

export default useUserStore
