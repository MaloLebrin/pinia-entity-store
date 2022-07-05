import useUserStore from './store/userStore'
import { isArray, isArrayOfNumbers } from './utils/array'
import { getExpectedObjectProperties, user } from './utils/dataFixtures'

describe('setCurrent action should return correct value', () => {
  beforeEach(() => {
    const app = createApp({})
    const pinia = createPinia()
    app.use(pinia)
    setActivePinia(pinia)
    const { setCurrent } = useUserStore()

    setCurrent(user)
  })

  it('getter current return correct value', () => {
    const userStore = useUserStore()

    expect(noNull(userStore.getCurrent)).toBeTruthy()

    expect(getExpectedObjectProperties(userStore.getCurrent)).toBeTruthy()
    expect(userStore.getCurrent.id).toBe(1)
    expect(userStore.getCurrent.email).toBe(user.email)
    expect(userStore.getCurrent.token).toBe(user.token)
    expect(userStore.getCurrent.firstName).toBe(user.firstName)
    expect(userStore.getCurrent.lastName).toBe(user.lastName)
    expect(userStore.getCurrent.companyName).toBe(user.companyName)
  })

  it('getter findOneById return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.findOneById(1)).toBeUndefined()

    const userFinded = userStore.findOneById(1)
    expect(userFinded).toBeUndefined()
    expect(noNull(userFinded)).toBeTruthy()
    expect(getExpectedObjectProperties(userFinded)).toBeFalsy()

    const userNotFinded = userStore.findOneById(999)
    expect(userNotFinded).toBeUndefined()
    expect(getExpectedObjectProperties(userNotFinded)).toBeFalsy()
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

  afterEach(() => {
    const { resetState } = useUserStore()

    resetState()
  })
})
