## Create the state

In this exemple, we want to create a store, who will manage the User entity. We assume that you have created a Typescript interface representing the entity managed by the store

### Create a basic state

```ts{3,6}
// userState.ts

import { createState } from '@malolebrin/pinia-entity-store'
import type { UserEntity } from '~/types'

export const userState = createState<UserEntity>()
```

The state will look like this:

```ts
  entities: {
    byId: Record<number, UserEntity>,
    allIds: number[]
    current: UserEntity | null
    active: number[]
  }
```

You can of course extend the state as much and as you want.

### Create a extended state

```ts{8}
// userState.ts

import { createState } from '@malolebrin/pinia-entity-store'
import type { UserEntity } from '~/types'

export const userState = {
  ...createState<UserEntity>(),
  currentUserToken: null
}
```

The extended state will look like this:
```ts{8}
  {
    entities: {
      byId: Record<number, UserEntity>,
      allIds: number[]
      current: UserEntity | null
      active: number[]
    },
    currentUserToken: string | null
  }
```
