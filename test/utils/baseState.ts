import createEntity from '../../src/createEntity'
import createState from '../../src/createState'
import type { UserEntity } from '~/types'

export const userEntity = createEntity<UserEntity>('user')

export const userState = defaultState()

export function defaultState() {
  return {
    ...createState<UserEntity>(userEntity),
  }
}
