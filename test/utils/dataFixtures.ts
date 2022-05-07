import { hasOwnProperty } from '@antfu/utils'
import type { UserEntity } from '~/types'

export const user = {
  id: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: 'test@test.com',
  token: 'test',
  firstName: 'test',
  lastName: 'test',
  companyName: 'test',
}

export function getExpectedObjectProperties(user: UserEntity) {
  return hasOwnProperty(user, 'id')
    || hasOwnProperty(user, 'email')
    || hasOwnProperty(user, 'firstName')
    || hasOwnProperty(user, 'lastName')
    || hasOwnProperty(user, 'companyName')
    || hasOwnProperty(user, 'token')
}
