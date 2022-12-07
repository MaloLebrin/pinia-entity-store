import {
  defaultTestInit,
  getExpectedObjectProperties,
  isArray,
  isArrayOfNumbers,
  user,
} from '../utils'
import useCustomerStore from '../store/customerStore'

describe('setActive action should return correct value', () => {
  beforeEach(() => {
    defaultTestInit()
    const { setActive } = useCustomerStore()

    setActive(user.id)
  })

  it('getter current return correct value', () => {
    const customerStore = useCustomerStore()

    expect((customerStore.getCurrent)).toBeNull()
  })

  it('getter findOneById return correct value', () => {
    const customerStore = useCustomerStore()

    expect(customerStore.findOneById(1)).toBeUndefined()

    const userFinded = customerStore.findOneById(1)
    expect(userFinded).toBeUndefined()
    expect(noNull(userFinded)).toBeTruthy()
    expect(getExpectedObjectProperties(userFinded)).toBeFalsy()

    const userNotFound = customerStore.findOneById(999)
    expect(userNotFound).toBeUndefined()
    expect(getExpectedObjectProperties(userNotFound)).toBeFalsy()
  })

  it('getter getAll return correct value', () => {
    const customerStore = useCustomerStore()

    expect(customerStore.getAll).toBeDefined()
    expect(typeof customerStore.getAll).toBe('object')
    expect(customerStore.getAll[1]).toBeUndefined()
    expect(getExpectedObjectProperties(customerStore.getAll[1])).toBeFalsy()
  })

  it('getter getAllArray return correct value', () => {
    const customerStore = useCustomerStore()

    expect(customerStore.getAllArray).toBeDefined()
    expect(customerStore.getAllArray).toHaveLength(0)
    expect(getExpectedObjectProperties(customerStore.getAllArray[0])).toBeFalsy()
  })

  it('getter getAllIds return correct value', () => {
    const customerStore = useCustomerStore()

    expect(customerStore.getAllIds).toBeDefined()
    expect(customerStore.getAllIds).toHaveLength(0)
    expect(customerStore.getAllIds[0]).toBeUndefined()
    expect(isArray(customerStore.getAllIds)).toBeTruthy()
    expect(isArrayOfNumbers(customerStore.getAllIds)).toBeFalsy()
  })

  it('getter getwhere return correct value', () => {
    const customerStore = useCustomerStore()

    const usersFinded = customerStore.getWhere(user => user.id === 1)
    expect(getExpectedObjectProperties(usersFinded[1])).toBeFalsy()
  })

  it('getter getwhereArray return correct value', () => {
    const customerStore = useCustomerStore()

    const usersFinded = customerStore.getWhereArray(user => user.id === 1)
    expect(usersFinded).toBeDefined()
    expect(usersFinded).toHaveLength(0)
    expect(isArray(usersFinded)).toBeTruthy()
    expect(isArrayOfNumbers(usersFinded)).toBeFalsy()
  })

  it('getter getIsEmpty return correct value', () => {
    const customerStore = useCustomerStore()

    expect(customerStore.getIsEmpty).toBeTruthy()
    expect(customerStore.getIsNotEmpty).toBeFalsy()
  })

  it('getter getOne return correct value', () => {
    const customerStore = useCustomerStore()

    expect(customerStore.getOne(1)).toBeUndefined()
    expect(getExpectedObjectProperties(customerStore.getOne(1))).toBeFalsy()
    expect(customerStore.getOne(999)).toBeUndefined()
    expect(customerStore.getOne(1)).toBeUndefined()
  })

  it('getActive return correct value', () => {
    const customerStore = useCustomerStore()

    expect(customerStore.getActive).toBeDefined()
    expect(customerStore.getActive).toHaveLength(1)
    expect(isArray(customerStore.getActive)).toBeTruthy()
    expect(isArrayOfNumbers(customerStore.getActive)).toBeTruthy()
  })

  it('getFirstActive', () => {
    const customerStore = useCustomerStore()

    expect(customerStore.getFirstActive).toBeDefined()
    expect(customerStore.getFirstActive).toBe(1)
  })

  afterEach(() => {
    const { resetState } = useCustomerStore()

    resetState()
  })
})
