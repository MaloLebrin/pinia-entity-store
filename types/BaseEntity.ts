import type { schema } from 'normalizr'

export interface BaseEntity<T> {
  path: string
  mutationPrefix: string
  actionPrefix: string
  singleSchema: schema.Entity<T>
  multipleSchema: schema.Array<T>
}
