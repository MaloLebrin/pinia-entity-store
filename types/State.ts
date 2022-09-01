import type { Id } from './WithId'

export interface State<T> {
  entities: {
    byId: Record<Id, CreatedEntity<T>>
    allIds: Id[]
    current: CreatedEntity<T> | null
    active: Id[]
  }
}

export type CreatedEntity<T> = T & { $isDirty: boolean }
