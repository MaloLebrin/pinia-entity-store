import type { Id } from './WithId'

export interface State<T> {
  entities: {
    byId: Record<Id, T>
    allIds: Id[]
    current: T | null
    active: Id[]
  }
}
