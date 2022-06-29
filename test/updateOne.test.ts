import useUserStore from './store/userStore'
import { isArray, isArrayOfNumbers } from './utils/array'
import { getExpectedObjectProperties, user2, usersArray } from './utils/dataFixtures'

describe('updateOne action should return correct value', () => {
  beforeEach(() => {
    const app = createApp({})
    const pinia = createPinia()
    app.use(pinia)
    setActivePinia(pinia)
    const { updateMany } = useUserStore()

    updateMany(usersArray)
  })

  it('getter current return correct value', () => {
    const userStore = useUserStore()
    expect(userStore.getCurrent).toBeNull()
  })

  it('getter findOneById return correct value', () => {
    const userStore = useUserStore()

    const userFinded = userStore.findOneById(1)
    const userFinded2 = userStore.findOneById(2)
    const usersArray = userStore.findManyById([1, 2])

    expect(userFinded).toBeDefined()
    expect(noNull(userFinded)).toBeTruthy()
    expect(getExpectedObjectProperties(userFinded)).toBeTruthy()

    expect(userFinded2).toBeDefined()
    expect(noNull(userFinded2)).toBeTruthy()
    expect(getExpectedObjectProperties(userFinded2)).toBeTruthy()

    expect(usersArray).toBeDefined()
    expect(noNull(usersArray)).toBeTruthy()
    usersArray.forEach(user => {
      expect(getExpectedObjectProperties(user)).toBeTruthy()
    })

    const userNotFinded = userStore.findOneById(999)
    expect(userNotFinded).toBeUndefined()
    expect(getExpectedObjectProperties(userNotFinded)).toBeFalsy()
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
    expect(isArray(userStore.getAllArray)).toBeTruthy()
    expect(isArrayOfNumbers(userStore.getAllArray)).toBeFalsy()
    expect(userStore.getAllArray).toHaveLength(2)
  })

  it('getter getAllIds return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getAllIds).toBeDefined()
    expect(userStore.getAllIds).toHaveLength(2)
    expect(userStore.getAllIds[0]).toBeDefined()
    expect(isArray(userStore.getAllIds)).toBeTruthy()
    expect(isArrayOfNumbers(userStore.getAllIds)).toBeTruthy()
  })

  it('getter getMissingIds return correct value', () => {
    const userStore = useUserStore()

    const ids = [1, 2, 3]
    expect(userStore.getMissingIds(ids)).toEqual([3])
    expect(userStore.getMissingIds(ids)).toHaveLength(1)
  })

  it('getter getMissingEntities return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getMissingEntities(usersArray)).toEqual([])
    expect(userStore.getMissingEntities(usersArray)).toHaveLength(0)
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

  afterEach(() => {
    const { resetState } = useUserStore()

    resetState()
  })
})
