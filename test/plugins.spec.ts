import useMainStore from './store/mainStore'
import useUserStore from './store/userStore'
import { defaultTestInit } from './utils/baseState'
import { user, user2, user3, user4 } from './utils/dataFixtures'

describe('setActive action should return correct value', () => {
  beforeEach(() => {
    defaultTestInit()
    const mainStore = useMainStore()
    const { setActive, createMany } = useUserStore()

    setActive(user.id)
  })

  it('have new state for each pinia stores created', () => {
    const mainStore = useMainStore()
    const userStore = useUserStore()
    const { createMany } = userStore
    createMany([user, user2, user3, user4])

    expect(mainStore.isTest).toBeTruthy()
    expect(mainStore.entities).toBeTruthy()
    expect(mainStore.entities.byId).toBeTruthy()

    expect(userStore.entities).toBeTruthy()
    expect(userStore.entities.byId).toBeTruthy()

    // expect(userStore.getAllArray.length).toBeGreaterThan(0)
  })
})

