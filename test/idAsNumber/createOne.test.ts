import { hasOwnProperty } from '@antfu/utils'
import useUserStore from '../store/userStore'
import { isArray, isArrayOfNumbers } from '../utils/array'
import { getExpectedObjectProperties, user, user2, user3, user4, usersArray } from '../utils/dataFixtures'

describe('create action should return correct value', () => {
  beforeEach(() => {
    const app = createApp({})
    const pinia = createPinia()
    app.use(pinia)
    setActivePinia(pinia)
    const { createMany } = useUserStore()
    const userStore = useUserStore()
    if (!userStore.isAlreadyInStore(user.id))
      createMany([user])
  })

  it('getter current return correct value', () => {
    const userStore = useUserStore()
    expect(userStore.getCurrent).toBeNull()
  })

  it('getter findOneById return correct value', () => {
    const userStore = useUserStore()

    const userFinded = userStore.findOneById(1)

    expect(userFinded).toBeDefined()
    expect(noNull(userFinded)).toBeTruthy()
    expect(getExpectedObjectProperties(userFinded)).toBeTruthy()

    const userNotFound = userStore.findOneById(999)
    expect(userNotFound).toBeUndefined()
    expect(getExpectedObjectProperties(userNotFound)).toBeFalsy()
  })

  it('getMany return correct Value', () => {
    const userStore = useUserStore()

    const userFinded = userStore.getMany([1])
    expect(userFinded).toBeDefined()
    expect(noNull(userFinded)).toBeTruthy()
    expect(isArray(userFinded)).toBeTruthy()
    expect(getExpectedObjectProperties(userFinded[0])).toBeTruthy()
  })

  it('getter getAll return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getAll).toBeDefined()
    expect(typeof userStore.getAll).toBe('object')
    expect(userStore.getAll[1]).toBeDefined()
    expect(getExpectedObjectProperties(userStore.getAll[1])).toBeTruthy()
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
    expect(isArrayOfNumbers(userStore.getAllIds)).toBeTruthy()
  })

  it('getter getMissingIds return correct value', () => {
    const userStore = useUserStore()

    const ids = [1, 2]
    expect(userStore.getMissingIds(ids)).toEqual([2])
  })

  it('getter getMissingEntities return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getMissingEntities(usersArray)).toEqual([user2, user3, user4])
  })

  it('getter getwhereArray return correct value', () => {
    const userStore = useUserStore()

    const usersFinded = userStore.getWhereArray(user => user.id === 1)
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

    expect(userStore.getOne(1)).toBeDefined()
    expect(getExpectedObjectProperties(userStore.getOne(1))).toBeTruthy()
    expect(userStore.getOne(999)).toBeUndefined()
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

    expect(userStore.isAlreadyInStore(1)).toBeTruthy()
  })

  it('$isDirty property exist and is false', () => {
    const userStore = useUserStore()
    const user = userStore.getOne(1)
    expect(hasOwnProperty(user, '$isDirty')).toBeTruthy()
    expect(user.$isDirty).toBeFalsy()
    expect(userStore.isDirty(user.id)).toBeFalsy()
  })

  afterEach(() => {
    const { resetState } = useUserStore()

    resetState()
  })
})
