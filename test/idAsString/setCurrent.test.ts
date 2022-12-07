import { isNumber, isString } from '@antfu/utils'
import useUserStore from '../store/userStore'
import {
  convertIdToString,
  defaultTestInit,
  getExpectedObjectProperties,
  isArray,
  isArrayOfNumbers,
  user,
  userIdString,
} from '../utils'

describe('setCurrent action should return correct value', () => {
  beforeEach(() => {
    defaultTestInit()
    const { setCurrent } = useUserStore()

    setCurrent(convertIdToString(user))
  })

  it('id of a user should be a string', () => {
    const userStore = useUserStore()
    const userId = userStore.getCurrent?.id
    expect(isNumber(userId)).toBeFalsy()
    expect(isString(userId)).toBeTruthy()
  })

  it('getter current return correct value', () => {
    const userStore = useUserStore()

    expect(noNull(userStore.getCurrent)).toBeTruthy()

    if (noNull(userStore.getCurrent)) {
      expect(getExpectedObjectProperties(userStore.getCurrent)).toBeTruthy()
      expect(userStore.getCurrent.id).toBe(userIdString)
      expect(userStore.getCurrent.email).toBe(user.email)
      expect(userStore.getCurrent.token).toBe(user.token)
      expect(userStore.getCurrent.firstName).toBe(user.firstName)
      expect(userStore.getCurrent.lastName).toBe(user.lastName)
      expect(userStore.getCurrent.companyName).toBe(user.companyName)
    }
  })

  it('getter findOneById return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.findOneById(userIdString)).toBeUndefined()

    const userFinded = userStore.findOneById(userIdString)
    expect(userFinded).toBeUndefined()
    expect(noNull(userFinded)).toBeTruthy()
    expect(getExpectedObjectProperties(userFinded)).toBeFalsy()

    const userNotFound = userStore.findOneById('999')
    expect(userNotFound).toBeUndefined()
    expect(getExpectedObjectProperties(userNotFound)).toBeFalsy()
  })

  it('getter getAll return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getAll).toBeDefined()
    expect(typeof userStore.getAll).toBe('object')
    expect(userStore.getAll[userIdString]).toBeUndefined()
    expect(getExpectedObjectProperties(userStore.getAll[userIdString])).toBeFalsy()
  })

  it('getter getAllArray return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getAllArray).toBeDefined()
    expect(userStore.getAllArray).toHaveLength(0)
    expect(getExpectedObjectProperties(userStore.getAllArray[0])).toBeFalsy()
  })

  it('getter getAllIds return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getAllIds).toBeDefined()
    expect(userStore.getAllIds).toHaveLength(0)
    expect(userStore.getAllIds[0]).toBeUndefined()
    expect(isArray(userStore.getAllIds)).toBeTruthy()
    expect(isArrayOfNumbers(userStore.getAllIds)).toBeFalsy()
  })

  it('getter getwhere return correct value', () => {
    const userStore = useUserStore()

    const usersFinded = userStore.getWhere(user => user.id === userIdString)
    expect(getExpectedObjectProperties(usersFinded[userIdString])).toBeFalsy()
  })

  it('getter getwhereArray return correct value', () => {
    const userStore = useUserStore()

    const usersFinded = userStore.getWhereArray(user => user.id === userIdString)
    expect(usersFinded).toBeDefined()
    expect(usersFinded).toHaveLength(0)
    expect(isArray(usersFinded)).toBeTruthy()
    expect(isArrayOfNumbers(usersFinded)).toBeFalsy()
  })

  it('getter getIsEmpty return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getIsEmpty).toBeTruthy()
    expect(userStore.getIsNotEmpty).toBeFalsy()
  })

  it('getter getOne return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getOne(userIdString)).toBeUndefined()
    expect(getExpectedObjectProperties(userStore.getOne(userIdString))).toBeFalsy()
    expect(userStore.getOne('999')).toBeUndefined()
    expect(userStore.getOne(userIdString)).toBeUndefined()
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

  afterEach(() => {
    const { resetState } = useUserStore()

    resetState()
  })
})
