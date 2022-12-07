## Create the store

Create a store as mentioned in the Pinia documentation.

Start by defining the starting state that you created previously ⬆️.


```ts{3,6}
// useUserStore.ts
import type { UserEntity } from '../../types'
import { userState } from './userState.ts'

export const useUserStore = defineStore('user', {
  state: () => ({ ...userState }),

  getters: {},

  actions: {},
})
```

