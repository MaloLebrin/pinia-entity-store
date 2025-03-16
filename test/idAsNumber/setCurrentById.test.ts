import { hasOwnProperty } from '@antfu/utils'
import useUserStore from '../store/userStore'
import { defaultTestInit, getExpectedObjectProperties, isArray, isArrayOfNumbers, user } from '../utils'

describe('setCurrent action should return correct value', () => {
  const pinia = defaultTestInit()
  beforeEach(() => {
    const { setCurrentById, createOne } = useUserStore(pinia)
    createOne(user)
    setCurrentById(user.id)
  })

  it('getter current return correct value', () => {
    const userStore = useUserStore(pinia)

    expect(noNull(userStore.getCurrentById)).toBeTruthy()

    if (noNull(userStore.getCurrentById)) {
      expect(getExpectedObjectProperties(userStore.getCurrentById)).toBeTruthy()
      expect(hasOwnProperty(userStore.getCurrentById, '$isDirty')).toBeTruthy()
      expect(userStore.getCurrentById.id).toBe(1)
      expect(userStore.getCurrentById.email).toBe(user.email)
      expect(userStore.getCurrentById.token).toBe(user.token)
      expect(userStore.getCurrentById.firstName).toBe(user.firstName)
      expect(userStore.getCurrentById.lastName).toBe(user.lastName)
      expect(userStore.getCurrentById.companyName).toBe(user.companyName)
      expect(userStore.getCurrentById.$isDirty).toBeFalsy()
    }
  })

  it('getter findOneById return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.findOneById(1)).toBeUndefined()

    const userFinded = userStore.findOneById(1)
    expect(userFinded).toBeUndefined()
    expect(noNull(userFinded)).toBeTruthy()
    expect(getExpectedObjectProperties(userFinded)).toBeFalsy()

    const userNotFound = userStore.findOneById(999)
    expect(userNotFound).toBeUndefined()
    expect(getExpectedObjectProperties(userNotFound)).toBeFalsy()
  })

  it('getter getAll return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getAll).toBeDefined()
    expect(typeof userStore.getAll).toBe('object')
    expect(userStore.getAll[1]).toBeUndefined()
    expect(getExpectedObjectProperties(userStore.getAll[1])).toBeFalsy()
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

    const usersFinded = userStore.getWhere(user => user.id === 1)
    expect(getExpectedObjectProperties(usersFinded[1])).toBeFalsy()
  })

  it('getter getwhereArray return correct value', () => {
    const userStore = useUserStore()

    const usersFinded = userStore.getWhereArray(user => user.id === 1)
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

    expect(userStore.getOne(1)).toBeUndefined()
    expect(getExpectedObjectProperties(userStore.getOne(1))).toBeFalsy()
    expect(userStore.getOne(999)).toBeUndefined()
    expect(userStore.getOne(1)).toBeUndefined()
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

  it('if entity is not in store, setCurrentById return null', () => {
    const userStore = useUserStore(pinia)

    expect(userStore.setCurrentById(999)).toBeUndefined()
  })

  afterEach(() => {
    const { resetState } = useUserStore()

    resetState()
  })
})
