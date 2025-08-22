// Core exports (new agnostic core)
export * from './core'

// Legacy exports for backward compatibility
import createActions from './core/actions'
import createGetters from './core/getters'
import createState from './core/state'
import type { ByIdParams, FilterFn, OptionalFilterFn, State, WithId } from './core/types'

export type {
    ByIdParams,
    FilterFn,
    OptionalFilterFn,
    State,
    WithId
}

export {
    createActions, createGetters, createState
}

// Re-export core functions with legacy names for compatibility
export { createEntityStore } from './core'
