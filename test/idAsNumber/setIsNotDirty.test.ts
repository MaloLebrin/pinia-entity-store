import { hasOwnProperty } from '@antfu/utils'
import useUserStore from '../store/userStore'
import { defaultTestInit } from '../utils/baseState'
import { getExpectedObjectProperties, usersArray } from '../utils/dataFixtures'

describe('setIsNotDirty action should turn to false dirty property', () => {
  beforeEach(() => {
    defaultTestInit()
    const { updateField, createMany } = useUserStore()

    createMany(usersArray)
    updateField('firstName', 'Malo', 1)
  })

  it('$isDirty property exist and is true', () => {
    const userStore = useUserStore()
    const user = userStore.getOne(1)
    expect(getExpectedObjectProperties(userStore.getOne(1))).toBeTruthy()
    expect(hasOwnProperty(user, '$isDirty')).toBeTruthy()
    expect(userStore.isDirty(user.id)).toBeTruthy()
  })

  it('field correctly updated', () => {
    const userStore = useUserStore()
    const user = userStore.getOne(1)
    expect(getExpectedObjectProperties(userStore.getOne(1))).toBeTruthy()
    expect(hasOwnProperty(user, 'firstName')).toBeTruthy()
    expect(user.firstName).not.toEqual(expect.stringMatching('test'))
    expect(user.firstName).toEqual(expect.stringMatching('Malo'))
    expect(userStore.isDirty(user.id)).toBeTruthy()
  })

  it('setisNotDirty change correclty isDirty value', () => {
    const userStore = useUserStore()
    const { setIsNotDirty } = userStore
    const user = userStore.getOne(1)
    setIsNotDirty(user.id)
    expect(hasOwnProperty(user, '$isDirty')).toBeTruthy()
    expect(userStore.getOne(1).$isDirty).toBeFalsy()
    expect(userStore.isDirty(user.id)).toBeFalsy()
  })

  afterEach(() => {
    const { resetState } = useUserStore()

    resetState()
  })
})
