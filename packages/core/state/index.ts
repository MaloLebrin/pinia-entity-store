import type { EntityStoreConfig, State, WithId } from '../types'

export function createState<T extends WithId>(config?: EntityStoreConfig<T>): State<T & { $isDirty: boolean }> {
  return {
    entities: {
      byId: {},
      allIds: [],
      current: null,
      currentById: null,
      active: [],
    },
  }
}

export function createInitialState<T extends WithId>(): State<T & { $isDirty: boolean }> {
  return createState<T>()
}

// Helper functions for state manipulation
export function addEntityToState<T extends WithId>(
  state: State<T & { $isDirty: boolean }>,
  entity: T & { $isDirty: boolean }
): void {
  if (!state.entities.byId[entity.id] && !state.entities.allIds.includes(entity.id)) {
    state.entities.allIds.push(entity.id)
  }
  state.entities.byId[entity.id] = entity
}

export function removeEntityFromState<T extends WithId>(
  state: State<T & { $isDirty: boolean }>,
  id: T['id']
): void {
  delete state.entities.byId[id]
  state.entities.allIds = state.entities.allIds.filter(entityId => entityId !== id)
}

export function updateEntityInState<T extends WithId>(
  state: State<T & { $isDirty: boolean }>,
  id: T['id'],
  updates: Partial<T>
): void {
  if (state.entities.byId[id]) {
    state.entities.byId[id] = {
      ...state.entities.byId[id],
      ...updates,
    }
  }
}

export function setEntityDirty<T extends WithId>(
  state: State<T & { $isDirty: boolean }>,
  id: T['id'],
  isDirty: boolean = true
): void {
  if (state.entities.byId[id]) {
    state.entities.byId[id] = {
      ...state.entities.byId[id],
      $isDirty: isDirty,
    }
  }
}
