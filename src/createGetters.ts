import { State, WithId } from "./types";

export default function createGetters<T extends WithId>(currentState: State<T>) {
  /**
   * Get a single item from the state by its id.
   * @param id - The id of the item
   */
  function findOneById(state = currentState) {
    return (id: number) => state.entities.byId[id]
  }

  /**
   * Get multiple itesm from the state by their ids.
   * @param ids - The ids of items
   */
  function findManyById(state = currentState) {
    return (ids: number[]) => ids.map(id => state.entities.byId[id])
  }

  /**
   * Get all the items from the state as a dictionnary of values.
   */
  function getAll(state = currentState) {
    return state.entities.byId
  }

  /**
   * Get all items from the state as an array of values.
   */
  function getAllArray(state = currentState) {
    return Object.values(state.entities.byId)
  }

  /**
   * Get an array containing the ids of all the items in the state.
   */
  function getAllIds(state = currentState) {
    return state.entities.allIds
  }

  /**
   * Get all the items that pass the given filter callback as a dictionnary of values.
   * @param filter - The filtering callback that will be used to filter the items.
   */
  function getWhere(state = currentState) {
    return (filter: (arg: T) => boolean | null) => {
      if (typeof filter !== 'function') {
        return state.entities.byId
      }
      return state.entities.allIds.reduce((acc: Record<number, T>, id: number) => {
        const item = state.entities.byId[id]
        if (!filter(item)) {
          return acc
        }
        acc[id] = item
        return acc
      }, {} as Record<number, T>)
    }
  }

  /**
   * Get all the items that pass the given filter callback as an array of values.
   * @param filter - The filtering callback that will be used to filter the items.
   */
  function getWhereArray(state = currentState) {
    return (filter: (arg: T) => boolean | null) => {
      if (typeof filter !== 'function') {
        return Object.values(state.entities.byId)
      }
      return Object.values(state.entities.allIds.reduce((acc: Record<number, T>, id: number) => {
        const item = state.entities.byId[id]
        if (!filter(item)) {
          return acc
        }
        acc[id] = item
        return acc
      }, {} as Record<number, T>))
    }
  }

  /**
   * Returns a boolean indicating wether or not the state is empty (contains no items).
   */
  function getIsEmpty(state = currentState) {
    return state.entities.allIds.length === 0
  }

  /**
   * Returns a boolean indicating wether or not the state is not empty (contains items).
  */
  function getIsNotEmpty(state = currentState) {
    return state.entities.allIds.length > 0
  }

  function getCurrent(state = currentState) {
    return state.entities.current
  }

  function getOne(state = currentState) {
    return (id: number) => state.entities.byId[id]
  }

  function getMany(state = currentState) {
    return (ids: number[]) => ids.map(id => state.entities.byId[id])
  }

  function getActive(state = currentState) {
    return state.entities.active
  }

  function getFirstActive(state = currentState) {
    return state.entities.active[0]
  }

  return {
    findManyById,
    findOneById,
    getActive,
    getAll,
    getAllArray,
    getAllIds,
    getCurrent,
    getFirstActive,
    getIsEmpty,
    getIsNotEmpty,
    getMany,
    getOne,
    getWhere,
    getWhereArray,
  }
}