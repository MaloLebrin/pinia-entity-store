import createState from '../../src/createState'
import type { UserEntity } from '../store/Store'

export const userState = defaultState()

export function defaultState() {
  return {
    ...createState<UserEntity>(),
  }
}
