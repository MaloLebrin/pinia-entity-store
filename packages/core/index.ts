// Types
export type {
    ByIdParams, EntityStore, EntityStoreConfig, FilterFn, Id, OptionalFilterFn, State, WithId
} from './types'

// State management
export {
    addEntityToState, createInitialState, createState, removeEntityFromState, setEntityDirty, updateEntityInState
} from './state'

// Actions
export { createActions } from './actions'

// Getters
export { createGetters } from './getters'

// Import types and functions for local use
import { createActions } from './actions'
import { createGetters } from './getters'
import { createState } from './state'
import type { EntityStoreConfig, WithId } from './types'

// Main factory function for creating entity stores
export function createEntityStore<T extends WithId>(config?: EntityStoreConfig<T>) {
  const state = createState<T>(config)
  const actions = createActions<T>(state, config)
  const getters = createGetters<T>(state)

  return {
    state,
    actions,
    getters,
    // Convenience methods that combine actions and getters
    createOne: actions.createOne,
    createMany: actions.createMany,
    updateOne: actions.updateOne,
    updateMany: actions.updateMany,
    deleteOne: actions.deleteOne,
    deleteMany: actions.deleteMany,
    setCurrent: actions.setCurrent,
    removeCurrent: actions.removeCurrent,
    setCurrentById: actions.setCurrentById,
    removeCurrentById: actions.removeCurrentById,
    setActive: actions.setActive,
    resetActive: actions.resetActive,
    setIsDirty: actions.setIsDirty,
    setIsNotDirty: actions.setIsNotDirty,
    updateField: actions.updateField,
    
    // Getters
    getOne: getters.getOne,
    getMany: getters.getMany,
    getAll: getters.getAll,
    getAllArray: getters.getAllArray,
    getAllIds: getters.getAllIds,
    getCurrent: getters.getCurrent,
    getCurrentById: getters.getCurrentById,
    getActive: getters.getActive,
    getFirstActive: getters.getFirstActive,
    getWhere: getters.getWhere,
    getWhereArray: getters.getWhereArray,
    getFirstWhere: getters.getFirstWhere,
    getIsEmpty: getters.getIsEmpty,
    getIsNotEmpty: getters.getIsNotEmpty,
    getMissingIds: getters.getMissingIds,
    getMissingEntities: getters.getMissingEntities,
    isAlreadyInStore: getters.isAlreadyInStore,
    isAlreadyActive: getters.isAlreadyActive,
    isDirty: getters.isDirty,
    search: getters.search,
    
    // Legacy compatibility
    findOneById: getters.findOneById,
    findManyById: getters.findManyById,
  }
}
