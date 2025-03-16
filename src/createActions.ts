import type { State } from './index'
import type { Id, WithId } from '~/types/WithId'

export default function createActions<T extends WithId>(state: State<T>) {
  return {
    /**
   * Create single entity in Store
   * @param payload Entity to create
   */
    createOne(payload: T): void {
      if (!state.entities.byId[payload.id] && !state.entities.allIds.includes(payload.id)) {
        state.entities.allIds.push(payload.id)
      }
      state.entities.byId[payload.id] = { ...payload, $isDirty: false }
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
      state.entities.current = { ...payload, $isDirty: false }
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
    updateOne(id: Id, payload: T): void {
      if (state.entities.byId[id]) {
        state.entities.byId[id] = {
          ...state.entities.byId[id],
          ...payload,
        }
        this.setIsDirty(id)
      }
      else {
        this.createOne(payload)
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
    deleteOne(id: Id) {
      delete state.entities.byId[id]
      state.entities.allIds = state.entities.allIds.filter(entityId => entityId !== id)
    },

    /**
   * delete many entities in Store
   * @param ids of entities to delete
   */
    deleteMany(ids: Id[]) {
      ids.forEach(id => this.deleteOne(id))
    },

    /**
     * reset entities.active to an empty Array
     */
    resetActive() {
      state.entities.active = []
    },

    /**
   * set one entity as active with his id
   * @param id of entity to set as active
   */
    setActive(id: Id) {
      if (!state.entities.active.includes(id))
        state.entities.active.push(id)
    },

    /**
   * set $isDirty property to true to know if the entity has been modified or not
   * @param id of entity
   */
    setIsDirty(id: Id) {
      if (state.entities.byId[id]) {
        state.entities.byId[id] = {
          ...state.entities.byId[id],
          $isDirty: true,
        }
      }
    },

    /**
   * set $isDirty property to false to know if the entity has been modified or not
   * @param id of entity
   */
    setIsNotDirty(id: Id) {
      if (state.entities.byId[id]) {
        state.entities.byId[id] = {
          ...state.entities.byId[id],
          $isDirty: false,
        }
      }
    },

    /**
     * update field of an entity
     * @param field: string field to update
     * @param id: Id of entity
     */
    updateField<K extends keyof T>(field: K, value: (T & { $isDirty: boolean })[K], id: Id) {
      if (state.entities.byId[id]) {
        state.entities.byId[id][field] = value
        this.setIsDirty(id)
      }
    },

    /**
     * set currentById entity
     * @param payload
     */
    setCurrentById(payload: Id) {
      if (state.entities.byId[payload]) {
        state.entities.currentById = payload
      }
    },

    /**
     * remove currentById entity
     */
    removeCurrentById() {
      state.entities.currentById = null
    },
  }
}
