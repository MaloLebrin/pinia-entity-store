import createEntity from '../../src/createEntity'
import createState from '../../src/createState'
import type { UserEntity } from '~/types'

export const userEntity = createEntity<UserEntity>('user')

export const userState = createState<UserEntity>(userEntity)
