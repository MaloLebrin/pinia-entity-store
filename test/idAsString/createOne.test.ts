import { isNumber, isString } from '@antfu/utils'
import useUserStore from '../store/userStore'
import { isArray, isArrayOfNumbers } from '../utils/array'
import { convertIdToString, getExpectedObjectProperties, user, user2, user3, user4, userIdString, userIdString2, usersArray } from '../utils/dataFixtures'

describe.only('create action should return correct value', () => {
  beforeEach(() => {
    const app = createApp({})
    const pinia = createPinia()
    app.use(pinia)
    setActivePinia(pinia)
    const { createMany } = useUserStore()
    const userStore = useUserStore()
    if (!userStore.isAlreadyInStore(user.id))
      createMany([convertIdToString(user)])
  })

  it('id of a user should be a string', () => {
    const userStore = useUserStore()
    const userId = userStore.getAllArray[0]?.id
    expect(isNumber(userId)).toBeFalsy()
    expect(isString(userId)).toBeTruthy()
  })

  it('getter current return correct value', () => {
    const userStore = useUserStore()
    expect(userStore.getCurrent).toBeNull()
  })

  it('getter findOneById return correct value', () => {
    const userStore = useUserStore()

    const userFinded = userStore.findOneById(userIdString)

    expect(userFinded).toBeDefined()
    expect(noNull(userFinded)).toBeTruthy()
    expect(getExpectedObjectProperties(userFinded)).toBeTruthy()

    const userNotFound = userStore.findOneById('999')
    expect(userNotFound).toBeUndefined()
    expect(getExpectedObjectProperties(userNotFound)).toBeFalsy()
  })

  it('getMany return correct Value', () => {
    const userStore = useUserStore()

    const userFinded = userStore.getMany([userIdString])
    expect(userFinded).toBeDefined()
    expect(noNull(userFinded)).toBeTruthy()
    expect(isArray(userFinded)).toBeTruthy()
    expect(getExpectedObjectProperties(userFinded[0])).toBeTruthy()
  })

  it('getter getAll return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getAll).toBeDefined()
    expect(typeof userStore.getAll).toBe('object')
    expect(userStore.getAll[userIdString]).toBeDefined()
    expect(getExpectedObjectProperties(userStore.getAll[userIdString])).toBeTruthy()
  })

  it('getter getAllArray return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getAllArray).toBeDefined()
    expect(getExpectedObjectProperties(userStore.getAllArray[0])).toBeTruthy()
  })

  it('getter getAllIds return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getAllIds).toBeDefined()
    expect(userStore.getAllIds).toHaveLength(1)
    expect(userStore.getAllIds[0]).toBeDefined()
    expect(isArray(userStore.getAllIds)).toBeTruthy()
    expect(isArrayOfNumbers(userStore.getAllIds)).toBeFalsy()
  })

  it('getter getMissingIds return correct value', () => {
    const userStore = useUserStore()

    const ids = [userIdString, userIdString2]
    expect(userStore.getMissingIds(ids)).toEqual([userIdString2])
  })

  it('getter getMissingEntities return correct value', () => {
    const userStore = useUserStore()
    const userArrayIdAsString = usersArray.map(user => convertIdToString(user))
    expect(userStore.getMissingEntities(userArrayIdAsString)).toEqual([convertIdToString(user2), convertIdToString(user3), convertIdToString(user4)])
  })

  it('getter getwhereArray return correct value', () => {
    const userStore = useUserStore()

    const usersFinded = userStore.getWhereArray(user => user.id.toString() === userIdString)
    expect(usersFinded).toBeDefined()
    expect(usersFinded).toHaveLength(1)
    expect(isArray(usersFinded)).toBeTruthy()
    expect(isArrayOfNumbers(usersFinded)).toBeFalsy()
  })

  it('getter getIsEmpty return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getIsEmpty).toBeFalsy()
    expect(userStore.getIsNotEmpty).toBeTruthy()
  })

  it('getter getOne return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getOne(userIdString)).toBeDefined()
    expect(getExpectedObjectProperties(userStore.getOne(userIdString))).toBeTruthy()
    expect(userStore.getOne('999')).toBeUndefined()
  })

  it('getActive return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getActive).toBeDefined()
    expect(userStore.getActive).toHaveLength(0)
    expect(isArray(userStore.getActive)).toBeTruthy()
  })

  it('getFirstActive', () => {
    const userStore = useUserStore()

    expect(userStore.getFirstActive).toBeUndefined()
  })

  it('isAlready in store return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.isAlreadyInStore(userIdString)).toBeTruthy()
  })

  it('search by sting should render user', () => {
    const userStore = useUserStore()
    const { createMany } = userStore
    createMany(usersArray)
    const users = userStore.search('test')

    expect(users).toBeTruthy()
    expect(users).toHaveLength(3)
    expect(users.every(user => getExpectedObjectProperties(userStore.getOne(user.id)))).toBeTruthy()
  })

  afterEach(() => {
    const { resetState } = useUserStore()

    resetState()
  })
})
