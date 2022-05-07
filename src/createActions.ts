import type { State, WithId } from '../types'

export default function createActions<T extends WithId>(state: State<T>) {
  /**
	 * Create single entity in Store
	 * @param payload Entity to create
	 */
  function createOne(payload: T): void {
    state.entities.byId[payload.id] = payload
    state.entities.allIds.push(payload.id)
  }

  /**
	 * Create Many entity in store
	 * @params payload Entities to create
	 */
  function createMany(payload: T[]): void {
    payload.map(entity => createOne(entity))
  }

  /**
	 * set current used entity
	 * @param payload
	 */
  function setCurrent(payload: T): void {
    state.entities.current = payload
  }

  /**
	 * set current used entity
	 * @param payload
	 */
  function removeCurrent() {
    state.entities.current = {} as T
  }

  /**
	 * Update One entiy in Store
	 * @param id of entity to update
	 * @param payload data of entity to update
	 */
  function updateOne(id: number, payload: T): void {
    state.entities.byId[id] = {
      ...state.entities.byId[id],
      ...payload,
    }
  }

  /**
	 * Update many entities in Store
	 * @param ids of entities to update
	 * @param payload data of entity to update
	 */
  function updateMany(payload: T[]): void {
    payload.map(entity => updateOne(entity.id, entity))
  }

  /**
	 * Delete many entity in Store
	 * @param id of entity to delete
	 */
  function deleteOne(id: number) {
    delete state.entities.byId[id]
    state.entities.allIds = state.entities.allIds.filter(entityId => entityId !== id)
  }

  /**
	 * delete many entities in Store
	 * @param ids of entities to delete
	 */
  function deleteMany(ids: number[]) {
    ids.map(id => deleteOne(id))
  }

  return {
    createOne,
    createMany,
    updateOne,
    updateMany,
    deleteOne,
    deleteMany,
    removeCurrent,
    setCurrent,
  }
}
