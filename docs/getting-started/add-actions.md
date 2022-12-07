### Add predefined Actions

import `createAction()` from the Api and add it to yours actions object

```ts{2,18}
// useUserStore.ts
import { createActions, createGetters } from '@malolebrin/pinia-entity-store'
import type { UserEntity } from '../../types'
import { userState } from './userState.ts'

export const useUserStore = defineStore('user', {
  state: () => ({ ...userState }),

  getters: {
    // Getters from Pinia-entity-store
    ...createGetters<UserEntity>(userState),

    // your customs getters bellow
  },

  actions: {
    // Actions from Pinia-entity-store
    ...createActions<UserEntity>(userState),

    // your customs actions bellow
    resetState() {
      this.$state = defaultState()
    }
  }
})
```

::: tip
Of course you can created your own [actions](https://pinia.vuejs.org/core-concepts/actions.html), like we do normaly with Pinia !
:::
