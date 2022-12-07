import useUserStore from '../store/userStore'
import {
  convertIdToString,
  getExpectedObjectProperties,
  isArray,
  isArrayOfNumbers,
  user,
  user2,
  user3,
  user4,
  userIdString,
  usersArray,
} from '../utils'

describe('delete action should return correct value', () => {
  beforeEach(() => {
    const app = createApp({})
    const pinia = createPinia()
    app.use(pinia)
    setActivePinia(pinia)
    const { createMany, deleteMany } = useUserStore()
    createMany([convertIdToString(user)])
    deleteMany([convertIdToString(user).id])
  })

  it('getter current return correct value', () => {
    const userStore = useUserStore()
    expect(userStore.getCurrent).toBeNull()
  })

  it('getter findOneById return correct value', () => {
    const userStore = useUserStore()

    const userFinded = userStore.findOneById(userIdString)

    expect(userFinded).toBeUndefined()
    expect(getExpectedObjectProperties(userFinded)).toBeFalsy()

    const userNotFound = userStore.findOneById('999')
    expect(userNotFound).toBeUndefined()
    expect(getExpectedObjectProperties(userNotFound)).toBeFalsy()
  })

  it('getter getAll return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getAll).toBeDefined()
    expect(typeof userStore.getAll).toBe('object')
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

  it('getter getMissingIds return correct value', () => {
    const userStore = useUserStore()

    const ids = [1, 2]
    expect(userStore.getMissingIds(ids)).toEqual(ids)
  })

  it('getter getMissingEntities return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getMissingEntities(usersArray)).toEqual([user, user2, user3, user4])
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
