import type { State, WithId } from './index'

export default function<T extends WithId>(): State<T & { $isDirty: boolean }> {
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
