import useUserStore from './store/userStore'
import { isArray, isArrayOfNumbers } from './utils/array'
import { getExpectedObjectProperties, user } from './utils/dataFixtures'

describe('createGetters Suite tests', () => {
  beforeAll(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  it('getter current return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getCurrent).toBe(null)

    userStore.setCurrent(user)

    expect(userStore.getCurrent).toBeDefined()
    expect(noNull(userStore.getCurrent)).toBeTruthy()
    if (noNull(userStore.getCurrent)) {
      expect(getExpectedObjectProperties(userStore.getCurrent)).toBeTruthy()
      expect(userStore.getCurrent.id).toBe(1)
      expect(userStore.getCurrent.email).toBe(user.email)
      expect(userStore.getCurrent.token).toBe(user.token)
      expect(userStore.getCurrent.firstName).toBe(user.firstName)
      expect(userStore.getCurrent.lastName).toBe(user.lastName)
      expect(userStore.getCurrent.companyName).toBe(user.companyName)
    }

    // expect(userStore.getFirstActive).toBe(user.id)
  })

  it('getter findOneById return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.findOneById(1)).toBeUndefined()

    userStore.createOne(user)

    const userFinded = userStore.findOneById(1)
    expect(userFinded).toBeDefined()
    expect(noNull(userFinded)).toBeTruthy()
    expect(getExpectedObjectProperties(userFinded)).toBeTruthy()

    const userNotFinded = userStore.findOneById(999)
    expect(userNotFinded).toBeUndefined()
    expect(getExpectedObjectProperties(userNotFinded)).toBe(false)
  })

  it('getter findManyById return correct value', () => {
    const userStore = useUserStore()

    const usersFinded = userStore.findManyById([1, 2, 3])
    expect(usersFinded).toBeDefined()
    expect(usersFinded.length).toEqual(1)
    expect(getExpectedObjectProperties(usersFinded[0])).toBeTruthy()
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
    expect(userStore.getAllArray.length).toEqual(1)
    expect(getExpectedObjectProperties(userStore.getAllArray[0])).toBeTruthy()
  })

  it('getter getAllIds return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getAllIds).toBeDefined()
    expect(userStore.getAllIds.length).toEqual(1)
    expect(userStore.getAllIds[0]).toEqual(1)
    expect(isArray(userStore.getAllIds)).toBeTruthy()
    expect(isArrayOfNumbers(userStore.getAllIds)).toBeTruthy()
  })

  it('getter getwhere return correct value', () => {
    const userStore = useUserStore()

    const usersFinded = userStore.getWhere(user => user.id === 1)
    expect(usersFinded).toBeDefined()
    expect(getExpectedObjectProperties(usersFinded[1])).toBeTruthy()
  })

  it('getter getwhereArray return correct value', () => {
    const userStore = useUserStore()

    const usersFinded = userStore.getWhereArray(user => user.id === 1)
    expect(usersFinded).toBeDefined()
    expect(usersFinded.length).toEqual(1)
    expect(getExpectedObjectProperties(usersFinded[0])).toBeTruthy()
    expect(isArray(usersFinded)).toBeTruthy()
    expect(isArrayOfNumbers(usersFinded)).toBe(false)
  })

  it('getter getIsEmpty return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getIsEmpty).toBe(false)
    expect(userStore.getIsNotEmpty).toBe(true)
    userStore.deleteOne(1)
    expect(userStore.getIsEmpty).toBe(true)
    expect(userStore.getIsNotEmpty).toBe(false)
    userStore.createOne(user)
  })

  it('getter getOne return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getOne(1)).toBeDefined()
    expect(getExpectedObjectProperties(userStore.getOne(1))).toBeTruthy()
    expect(userStore.getOne(999)).toBeUndefined()
    userStore.deleteOne(1)
    expect(userStore.getOne(1)).toBeUndefined()
    userStore.createOne(user)
  })

  it('getActive return correct value', () => {
    const userStore = useUserStore()
    const { setActive } = userStore

    expect(userStore.getActive).toBeDefined()
    expect(userStore.getActive.length).toEqual(0)
    expect(isArray(userStore.getActive)).toBeTruthy()

    setActive(user.id)
    expect(isArrayOfNumbers(userStore.getActive)).toBeTruthy()
    expect(userStore.getActive.length).toEqual(1)
  })

  it('getFirstActive', () => {
    const userStore = useUserStore()
    const { setActive, resetActive } = userStore

    expect(userStore.getFirstActive).toBe(1)

    resetActive()

    expect(userStore.getFirstActive).toBeUndefined()

    setActive(user.id + 1)
    setActive(user.id)
    expect(userStore.getFirstActive).toBe(2)
  })

  it('isAlreadyActive', () => {
    const userStore = useUserStore()
    const { resetActive } = userStore
    expect(userStore.isAlreadyActive(user.id)).toBe(true)
    resetActive()
    expect(userStore.isAlreadyActive(user.id)).toBe(false)
  })

  it('isAlreadyInStore', () => {
    const userStore = useUserStore()

    expect(userStore.isAlreadyInStore(user.id)).toBe(true)
    expect(userStore.isAlreadyInStore(user.id + 1)).toBe(false)
    userStore.deleteOne(1)
    expect(userStore.isAlreadyInStore(user.id)).toBe(false)
  })
})
