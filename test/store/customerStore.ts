import type { UserEntity } from './Store'
import createPiniaEntityStore from '.../../src/createPiniaEntityStore'

export const useCustomerStore = createPiniaEntityStore<UserEntity>({
  id: 'customer',
  options: {
    actions: {
    },
  },
})

export default useCustomerStore
