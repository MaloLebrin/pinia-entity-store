import type { BaseEntity, State } from '../types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function <T>(entity: BaseEntity<T>): State<T> {
  return {
    entities: {
      byId: {},
      allIds: [],
      current: null,
      active: [],
    },
  }
}
