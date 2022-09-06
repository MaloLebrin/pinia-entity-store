### Add predefined getters

import `createGetters()` from the Api and add it to yours getters object


```ts{2,11}
// useUserStore.ts
import { createGetters } from '@malolebrin/pinia-entity-store'
import type { UserEntity } from '../../types'
import { userState } from './userState.ts'

export const useUserStore = defineStore('user', {
  state: () => ({ ...userState }),

  getters: {
    // Getters from Pinia-entity-store
    ...createGetters<UserEntity>(userState),

    // your customs getters bellow
  },
  actions: {},
})
```
::: tip
Of course you can created your own [getters](https://pinia.vuejs.org/core-concepts/getters.html), like we do normaly with Pinia !
:::
