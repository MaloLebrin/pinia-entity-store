import type { State } from '../types'

export default function <T>(): State<T> {
  return {
    entities: {
      byId: {},
      allIds: [],
      current: null,
      active: [],
    },
  }
}
