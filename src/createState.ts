import type { State, WithId } from './index'
import type { CreatedEntity } from '~/types/State'

export default function <T extends WithId>(): State<T & { $isDirty: boolean }> {
  return {
    entities: {
      byId: {},
      allIds: [],
      current: null,
      active: [],
    },
  }
}
