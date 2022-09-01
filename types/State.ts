import type { Id } from './WithId'

export interface State<T> {
  entities: {
    byId: Record<Id, T & { $isDirty: boolean }>
    allIds: Id[]
    current: T & { $isDirty: boolean } | null
    active: Id[]
  }
}

// export type CreatedEntity<T> = T & { $isDirty: boolean }
