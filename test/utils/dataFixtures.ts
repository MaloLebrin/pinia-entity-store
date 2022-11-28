import { hasOwnProperty } from '@antfu/utils'
import type { UserEntity } from '../store/Store'
import type { WithId } from '~/types/WithId'

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

export const user3 = {
  id: 3,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: 'john@doe.com',
  token: 'doe',
  firstName: 'john',
  lastName: 'doe',
  companyName: 'johndoe',
}

export const user4 = {
  id: 4,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: 'harry@potter.com',
  token: 'harrypotter1',
  firstName: 'harry',
  lastName: 'potter',
  companyName: 'poudlard',
}

export const userIdString = 'f805d7cf-0608-4f01-8293-c910a0e55a4c'
export const userIdString2 = '6fcf61a8-20cc-4410-a703-774857584521'
export const userIdString3 = '6fcf61a8-20cc-4410-a703-7748573e7821'
export const userIdString4 = '6fcf61a8-20cc-4410-a703-7748573ea421'

export function convertIdToString<T extends WithId>(object: T): T {
  return {
    ...object,
    id: object?.id === 1 ? userIdString : userIdString2,
  }
}

export const usersArray: UserEntity[] = [user, user2, user3, user4]

export function getExpectedObjectProperties(user: UserEntity) {
  return hasOwnProperty(user, 'id')
    && hasOwnProperty(user, 'email')
    && hasOwnProperty(user, 'firstName')
    && hasOwnProperty(user, 'lastName')
    && hasOwnProperty(user, 'companyName')
    && hasOwnProperty(user, 'token')
}
