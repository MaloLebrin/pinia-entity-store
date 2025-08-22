import { addEntityToState, removeEntityFromState, setEntityDirty, updateEntityInState } from '../state'
import type { EntityStoreConfig, Id, State, WithId } from '../types'

export function createActions<T extends WithId>(
  state: State<T & { $isDirty: boolean }>,
  config?: EntityStoreConfig<T>
) {
  return {
    /**
     * Create single entity in Store
     * @param payload Entity to create
     */
    createOne(payload: T): void {
      // Validation hook
      if (config?.validateEntity) {
        const validation = config.validateEntity(payload)
        if (typeof validation === 'string') {
          throw new Error(`Entity validation failed: ${validation}`)
        }
        if (!validation) {
          throw new Error('Entity validation failed')
        }
      }

      const entityWithDirty = { ...payload, $isDirty: false }
      addEntityToState(state, entityWithDirty)
      
      // Lifecycle hook
      config?.onEntityCreated?.(payload)
    },

    /**
     * Create Many entities in store
     * @param payload Entities to create
     */
    createMany(payload: T[]): void {
      payload.forEach(entity => this.createOne(entity))
    },

    /**
     * Set current used entity
     * @param payload
     */
    setCurrent(payload: T) {
      state.entities.current = { ...payload, $isDirty: false }
    },

    /**
     * Remove current used entity
     */
    removeCurrent() {
      state.entities.current = null
    },

    /**
     * Update One entity in Store
     * @param id of entity to update
     * @param payload data of entity to update
     */
    updateOne(id: Id, payload: T): void {
      if (state.entities.byId[id]) {
        const previousEntity = { ...state.entities.byId[id] }
        updateEntityInState(state, id, payload)
        this.setIsDirty(id)
        
        // Lifecycle hook
        config?.onEntityUpdated?.(payload, previousEntity)
      } else {
        this.createOne(payload)
      }
    },

    /**
     * Update many entities in Store
     * @param payload entities to update
     */
    updateMany(payload: T[]): void {
      payload.forEach(entity => this.updateOne(entity.id, entity))
    },

    /**
     * Delete one entity in Store
     * @param id of entity to delete
     */
    deleteOne(id: Id) {
      const entity = state.entities.byId[id]
      if (entity) {
        removeEntityFromState(state, id)
        
        // Lifecycle hook
        config?.onEntityDeleted?.(entity)
      }
    },

    /**
     * Delete many entities in Store
     * @param ids of entities to delete
     */
    deleteMany(ids: Id[]) {
      ids.forEach(id => this.deleteOne(id))
    },

    /**
     * Reset entities.active to an empty Array
     */
    resetActive() {
      state.entities.active = []
    },

    /**
     * Set one entity as active with his id
     * @param id of entity to set as active
     */
    setActive(id: Id) {
      if (!state.entities.active.includes(id)) {
        state.entities.active.push(id)
      }
    },

    /**
     * Set $isDirty property to true to know if the entity has been modified or not
     * @param id of entity
     */
    setIsDirty(id: Id) {
      setEntityDirty(state, id, true)
    },

    /**
     * Set $isDirty property to false to know if the entity has been modified or not
     * @param id of entity
     */
    setIsNotDirty(id: Id) {
      setEntityDirty(state, id, false)
    },

    /**
     * Update field of an entity
     * @param field: string field to update
     * @param value: value to set
     * @param id: Id of entity
     */
    updateField<K extends keyof T>(field: K, value: T[K], id: Id) {
      if (state.entities.byId[id]) {
        state.entities.byId[id][field] = value
        this.setIsDirty(id)
      }
    },

    /**
     * Set currentById entity
     * @param payload
     */
    setCurrentById(payload: Id) {
      if (state.entities.byId[payload]) {
        state.entities.currentById = payload
      }
    },

    /**
     * Remove currentById entity
     */
    removeCurrentById() {
      state.entities.currentById = null
    },
  }
}
