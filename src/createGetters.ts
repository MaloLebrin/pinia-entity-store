import { uniq } from '@antfu/utils'
import type { State } from './index'
import type { Id, WithId } from '~/types/WithId'

export default function createGetters<T extends WithId>(currentState: State<T>) {
  /**
   * Get a single item from the state by its id.
   * @param id - The id of the item
   * @Deprecated use getOne
   */
  function findOneById(state = currentState) {
    return (id: Id) => state.entities.byId[id]
  }

  /**
   * Get multiple items from the state by their ids.
   * @param ids - The ids of items
   * @Deprecated use getMany
   */
  function findManyById(state = currentState) {
    return (ids: Id[]) => ids.map(id => state.entities.byId[id]).filter(id => id)
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
   * @param ids Id[]
   * @param canHaveDuplicates boolean not required
   * @returns returns a list of missing IDs in the store compared to the ids passed to the getter. with an option to filter out duplicates
   */
  function getMissingIds(state = currentState) {
    return (ids: Id[], canHaveDuplicates?: boolean) => {
      const filteredIds = ids.filter(id => !state.entities.allIds.includes(id))
      if (!canHaveDuplicates)
        return uniq(filteredIds)

      return filteredIds
    }
  }

  /**
  * @param entitiesArray T[]
  * @returns returns a list of missing entities in the store
  */
  function getMissingEntities(state = currentState) {
    return (entitiesArray: T[]) => {
      if (entitiesArray?.length > 0)
        return entitiesArray.filter(entity => !state.entities.allIds.includes(entity.id))

      return []
    }
  }

  /**
   * Get all the items that pass the given filter callback as a dictionnary of values.
   * @param filter - The filtering callback that will be used to filter the items.
   */
  function getWhere(state = currentState) {
    return (filter: (arg: T) => boolean | null) => {
      if (typeof filter !== 'function')
        return state.entities.byId

      return state.entities.allIds.reduce((acc: Record<Id, T & { $isDirty: boolean }>, id: Id) => {
        const item = state.entities.byId[id]
        if (!filter(item))
          return acc

        acc[id] = item
        return acc
      }, {} as Record<Id, T & { $isDirty: boolean }>)
    }
  }

  /**
   * Get all the items that pass the given filter callback as an array of values.
   * @param filter - The filtering callback that will be used to filter the items.
   */
  function getWhereArray(state = currentState) {
    return (filter: (arg: T) => boolean | null) => {
      if (typeof filter !== 'function')
        return Object.values(state.entities.byId)

      return Object.values(state.entities.allIds.reduce((acc: Record<Id, T & { $isDirty: boolean }>, id: Id) => {
        const item = state.entities.byId[id]
        if (!filter(item))
          return acc

        acc[id] = item
        return acc
      }, {} as Record<Id, T & { $isDirty: boolean }>))
    }
  }

  /**
   * Get the first item that passes the given filter callback.
   * @param filter - The filtering callback that will be used to filter the items.
   * @returns The first item that passes the filter, or the first item in the state if no filter is provided.
   */
  function getFirstWhere(state = currentState) {
    return (filter: (arg: T) => boolean | null) => {
      if (typeof filter !== 'function')
        return Object.values(state.entities.byId)[0]

      return Object.values(state.entities.allIds.reduce((acc: Record<Id, T & { $isDirty: boolean }>, id: Id) => {
        const item = state.entities.byId[id]
        if (!filter(item))
          return acc

        acc[id] = item
        return acc
      }, {} as Record<Id, T & { $isDirty: boolean }>))[0]
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

  /**
   * @return current entity stored in state
   */
  function getCurrent(state = currentState) {
    return state.entities.current
  }

  /**
   * Get a single item from the state by its id.
   * @param id - The id of the item
   */
  function getOne(state = currentState) {
    return (id: Id) => state.entities.byId[id]
  }

  /**
   * Get a array of items from the state by their ids.
   * @param ids - ids of items
   */
  function getMany(state = currentState) {
    return (ids: Id[]) => ids.map(id => state.entities.byId[id]).filter(id => id)
  }

  /**
   *  @return array of active entities stored in state
   */
  function getActive(state = currentState) {
    return state.entities.active
  }

  /**
   *  @return first entity get from array of active entities stored in state
   */
  function getFirstActive(state = currentState) {
    return state.entities.active[0]
  }

  /**
   * helper to determine if the entity is already stored in state
   * @param id - The id of the item
   *  @return boolean
   */
  function isAlreadyInStore(state = currentState) {
    return (id: Id) => state.entities.allIds.includes(id)
  }

  /**
   * helper to determine if the entity is already set as Active in state
   * @param id - The id of the item
   *  @return boolean
   */
  function isAlreadyActive(state = currentState) {
    return (id: Id) => state.entities.active.includes(id)
  }

  /**
   * helper to know if an entity has been modified
   *  @param id - The id of the item
   *  @return boolean
   */
  function isDirty(state = currentState) {
    return (id: Id) => state.entities.byId[id].$isDirty
  }

  /**
   * Search for an entity in the state
   * @param field - The field to search for
   * @return array of entities
   */
  function search(state = currentState) {
    return (field: string) => Object.values(state.entities.byId)
      .filter(item => {
        const regex = new RegExp(field, 'i')
        for (const value of Object.values(item)) {
          if (typeof value === 'string' && regex.test(value)) {
            return true
          }
        }
        return false
      })
  }

  /**
   * Get currentById entity stored in state
   */
  function getCurrentById(state = currentState) {
    return state.entities.currentById ? state.entities.byId[state.entities.currentById] : null
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
    getFirstWhere,
    getIsEmpty,
    getIsNotEmpty,
    getMany,
    getMissingEntities,
    getMissingIds,
    getOne,
    getWhere,
    getWhereArray,
    isAlreadyActive,
    isAlreadyInStore,
    isDirty,
    search,
    getCurrentById,
  }
}
