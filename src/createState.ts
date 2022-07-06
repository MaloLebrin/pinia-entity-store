import type { State } from './index'

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
