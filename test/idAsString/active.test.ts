import { isNumber, isString } from '@antfu/utils'
import useUserStore from '../store/userStore'
import {
  convertIdToString,
  getExpectedObjectProperties,
  isArray,
  isArrayOfNumbers,
  user,
  userIdString,
} from '../utils'

describe('setActive action should return correct value', () => {
  beforeEach(() => {
    const app = createApp({})
    const pinia = createPinia()
    app.use(pinia)
    setActivePinia(pinia)
    const { setActive } = useUserStore()

    setActive(convertIdToString(user).id)
  })

  it('id of a user should be a string', () => {
    const userStore = useUserStore()
    const userId = userStore.getFirstActive
    expect(isNumber(userId)).toBeFalsy()
    expect(isString(userId)).toBeTruthy()
  })

  it('getter current return correct value', () => {
    const userStore = useUserStore()

    expect((userStore.getCurrent)).toBeNull()
  })

  it('getter findOneById return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.findOneById(userIdString)).toBeUndefined()

    const userFinded = userStore.findOneById(userIdString)
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

    // eslint-disable-next-line eqeqeq
    const usersFinded = userStore.getWhere(user => user.id == 1)
    expect(getExpectedObjectProperties(usersFinded[1])).toBeFalsy()
  })

  it('getter getwhereArray return correct value', () => {
    const userStore = useUserStore()

    // eslint-disable-next-line eqeqeq
    const usersFinded = userStore.getWhereArray(user => user.id == 1)
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
    expect(userStore.getOne(999)).toBeUndefined()
    expect(userStore.getOne(userIdString)).toBeUndefined()
  })

  it('getActive return correct value', () => {
    const userStore = useUserStore()

    expect(userStore.getActive).toBeDefined()
    expect(userStore.getActive).toHaveLength(1)
    expect(isArray(userStore.getActive)).toBeTruthy()
    expect(isArrayOfNumbers(userStore.getActive)).toBeFalsy()
  })

  it('getFirstActive', () => {
    const userStore = useUserStore()

    expect(userStore.getFirstActive).toBeDefined()
    expect(userStore.getFirstActive).toBe(userIdString)
  })

  afterEach(() => {
    const { resetState } = useUserStore()

    resetState()
  })
})
