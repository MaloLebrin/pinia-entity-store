import type { State, WithId } from './index'
import type { CreatedEntity } from '~/types/State'

export default function <T extends WithId>(): State<CreatedEntity<T>> {
  return {
    entities: {
      byId: {},
      allIds: [],
      current: null,
      active: [],
    },
  }
}
