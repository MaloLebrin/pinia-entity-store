import createState from '../../src/createState'
import type { UserEntity } from '../store/Store'

export const userState = defaultState()

export function defaultState() {
  return {
    ...createState<UserEntity>(),
  }
}

export function defaultTestInit() {
  const app = createApp({})
  const pinia = createPinia()
  app.use(pinia)
  setActivePinia(pinia)
}
