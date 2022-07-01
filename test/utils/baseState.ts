import createState from '../../src/createState'
import type { UserEntity } from '~/types'

export const userState = defaultState()

export function defaultState() {
  return {
    ...createState<UserEntity>(),
  }
}
