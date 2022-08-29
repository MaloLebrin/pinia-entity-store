import type { Id } from './WithId'

export interface ByIdParams<T> {
  id: Id
  payload: T
}
