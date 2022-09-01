import { hasOwnProperty } from '@antfu/utils'
import useUserStore from '../store/userStore'
import { getExpectedObjectProperties, usersArray } from '../utils/dataFixtures'

describe('updateField action should return correct value', () => {
  beforeEach(() => {
    const app = createApp({})
    const pinia = createPinia()
    app.use(pinia)
    setActivePinia(pinia)
    const { updateField, createMany } = useUserStore()

    createMany(usersArray)
    updateField('firstName', 'Malo', 1)
  })

  it('$isDirty property exist and is false', () => {
    const userStore = useUserStore()
    const user = userStore.getOne(1)
    expect(getExpectedObjectProperties(userStore.getOne(1))).toBeTruthy()
    expect(hasOwnProperty(user, '$isDirty')).toBeTruthy()
    expect(userStore.isDirty(user.id)).toBeTruthy()
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

  afterEach(() => {
    const { resetState } = useUserStore()

    resetState()
  })
})
