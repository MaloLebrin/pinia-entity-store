<div align="center" style="display:flex">
  <h1 style="margin-right: 2rem">Pinia-Entity-Store </h1>
  <a href="https://pinia.vuejs.org" target="_blank" rel="noopener noreferrer">
    <img width="50" src="https://pinia.vuejs.org/logo.svg" alt="Pinia logo">
  </a>
</div>
<br/>

A lightweight Pinia plugin to manage relational entities in Pinia without having to learn a whole new ORM

## Roadmap:

 * [x] Add is Already in store and Already active getters
 * [x] Fully tested plugin  with [Vitest](https://vitest.dev/)
 * [ ] Make Pinia entity store as [plugin for Pinia](https://pinia.vuejs.org/core-concepts/plugins.html)
 * [ ] Create documentation
 * [ ] Create offical release

## Contributions:

👍🎉 First off, thanks for taking the time to contribute! 🎉👍

### How Can I Contribute?

#### Pull Requests

The process described here has several goals:

- Maintain pinia-entity-store's quality
- Fix problems that are important to users
- Enable a sustainable system for pinia-entity-store's maintainers to review contributions

You can create PR as your wish to fix bug, and create features


## How to use It ?

🔴 At the moment the package is not released yet, because it is still young.
It has no published release.
You can obviously make changes to contribute to the projects in order to advance the roadmap

✅ However the features of Pinia Entity Store can be used without concern. They are tested and already used in some projects


### Create the state

```ts
// userState.ts

import createEntity from '../../src/createEntity'
import createState from '../../src/createState'
import type { UserEntity } from '~/types'

export const userEntity = createEntity<UserEntity>('user')

export const userState = createState<UserEntity>(userEntity)
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

### Create the store


```ts
// useUserStore.ts

import { userState } from '../utils/baseState'
import type { UserEntity } from '../../types'
import { createActions, createGetters } from '../../src'

export const useUserStore = defineStore('user', {
  state: () => ({ ...userState }),

  getters: {
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

## List of getters:




## License

[MIT](http://opensource.org/licenses/MIT)
