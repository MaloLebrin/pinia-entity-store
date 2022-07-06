import { hasOwnProperty } from '@antfu/utils'
import type { UserEntity } from '../store/Store'

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
export const user2 = {
  id: 2,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: 'test2@test.com',
  token: 'test2',
  firstName: 'test2',
  lastName: 'test2',
  companyName: 'test2',
}

export const usersArray: UserEntity[] = [user, user2]

export function getExpectedObjectProperties(user: UserEntity) {
  return hasOwnProperty(user, 'id')
    || hasOwnProperty(user, 'email')
    || hasOwnProperty(user, 'firstName')
    || hasOwnProperty(user, 'lastName')
    || hasOwnProperty(user, 'companyName')
    || hasOwnProperty(user, 'token')
}
