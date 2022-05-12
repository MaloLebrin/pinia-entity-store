# Pinia-Entity-Store
A lightweight Pinia plugin to manage relational entities in Pinia without having to learn a whole new ORM

## Roadmap:

 * [x] Add is Already in store and Already active getters
 * [ ] Fully tested plugin  with [Vitest](https://vitest.dev/)
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

 ⚠️ For the moment I have not managed to create a function to create actions as is the case for getters. You can of course contribute to the project by making PR.

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
    createOne(payload: UserEntity): void {
      this.entities.byId[payload.id] = payload
      this.entities.allIds.push(payload.id)
    },
    createMany(payload: UserEntity[]) {
      payload.forEach(entity => this.createOne(entity))
    },
    setCurrent(payload: UserEntity) {
      this.entities.current = payload
    },
    removeCurrent() {
      this.entities.current = null
    },
    updateOne(id: number, payload: UserEntity): void {
      if (this.isAlreadyInStore(id)) {
        const entity = this.entities.byId[id]
        this.entities.byId[id] = {
          ...entity,
          ...payload,
        }
      }
      else {
        this.createOne(payload)
      }
    },
    updateMany(payload: UserEntity[]): void {
      payload.forEach(entity => this.updateOne(entity.id, entity))
    },
    deleteOne(id: number) {
      delete this.entities.byId[id]
      this.entities.allIds = this.entities.allIds.filter(entityId => entityId !== id)
    },
    deleteMany(ids: number[]) {
      ids.forEach(id => this.deleteOne(id))
    },
    setActive(id: number) {
      if (!this.isAlreadyActive(id))
        this.entities.active.push(id)
    },
    resetActive() {
      this.entities.active = []
    },

    // your customs actions bellow
  }
})
```

## List of getters:




## License

[MIT](http://opensource.org/licenses/MIT)
