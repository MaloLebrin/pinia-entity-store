import type { State, WithId } from '../types'
// import type {  } from 'pinia'

export default function createActions<T extends WithId>(state: State<T>) {
  return {
    /**
   * Create single entity in Store
   * @param payload Entity to create
   */
    createOne(payload: T): void {
      if (state.entities.byId[payload.id]) {
        state.entities.byId[payload.id] = {
          ...state.entities.byId[payload.id],
          ...payload,
        }
      }
      else {
        state.entities.byId[payload.id] = payload
        state.entities.allIds.push(payload.id)
      }
    },

    /**
   * Create Many entity in store
   * @params payload Entities to create
   */
    createMany(payload: T[]): void {
      payload.forEach(entity => this.createOne(entity))
    },

    /**
     * set current used entity
     * @param payload
     */
    setCurrent(payload: T) {
      state.entities.current = payload
    },

    /**
   * remove current used entity
   * @param payload
   */
    removeCurrent() {
      state.entities.current = null
    },

    /**
     * Update One entiy in Store
     * @param id of entity to update
     * @param payload data of entity to update
     */
    updateOne(id: number, payload: T): void {
      if (state.entities.byId[id]) {
        state.entities.byId[id] = {
          ...state.entities.byId[id],
          ...payload,
        }
      } else {
        state.entities.byId[payload.id] = payload
        state.entities.allIds.push(payload.id)
      }
    },

    /**
     * Update many entities in Store
     * @param ids of entities to update
     * @param payload data of entity to update
     */
    updateMany(payload: T[]): void {
      payload.forEach(entity => this.updateOne(entity.id, entity))
    },

    /**
   * Delete one entity in Store
   * @param id of entity to delete
   */
    deleteOne(id: number) {
      delete state.entities.byId[id]
      state.entities.allIds = state.entities.allIds.filter(entityId => entityId !== id)
    },

    /**
   * delete many entities in Store
   * @param ids of entities to delete
   */
    deleteMany(ids: number[]) {
      ids.forEach(id => this.deleteOne(id))
    },

    resetActive() {
      state.entities.active = []
    },

    setActive(id: number) {
      if (!state.entities.active.includes(id))
        state.entities.active.push(id)
    },
  }
}
