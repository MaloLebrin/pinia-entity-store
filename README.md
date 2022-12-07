<div align="center" style="display:flex">
  <h1 style="margin-right: 2rem">Pinia-Entity-Store </h1>
  <a href="https://pinia.vuejs.org" target="_blank" rel="noopener noreferrer">
    <img width="50" src="https://pinia.vuejs.org/logo.svg" alt="Pinia logo">
  </a>
</div>
<br/>

[![Node.js Package](https://github.com/MaloLebrin/pinia-entity-store/actions/workflows/npm-publish-github-packages.yml/badge.svg)](https://github.com/MaloLebrin/pinia-entity-store/actions/workflows/npm-publish-github-packages.yml)

A fully typed lightweight Pinia plugin to manage relational entities in Pinia without having to learn a whole new ORM

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
It has no published release on github.
You can obviously make changes to contribute to the projects in order to advance the roadmap

✅ However the features of Pinia Entity Store can be used without concern. They are tested and already used in some projects

### Install package

```
npm i @malolebrin/pinia-entity-store

// or

yarn add @malolebrin/pinia-entity-store

// or

pnpm i @malolebrin/pinia-entity-store

```


### Create the state

```ts
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

### Create the store


```ts
// useUserStore.ts
import { createActions, createGetters } from '@malolebrin/pinia-entity-store'
import type { UserEntity } from '../../types'
import { userState } from './userState.ts'

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


- `getOne`: return a single item from the state by its id.
- `getMany`: return a array of items from the state by their ids.
- `getAll`: return all entities as Record<number, Entity>
- `getAllArray`: return all entities in the store as Entity[]
- `getAllIds`: return all ids for entities in the store as number[]
- `getMissingIds`: returns a list of missing IDs in the store compared to the ids passed to the getter. with an option to filter out duplicates
- `getMissingEntities`: returns a list of missing entities in the store compared to the entities passed to the getter.
- `getWhere`: Get all the items that pass the given filter callback as a dictionnary of values.
```ts
const userStore = useUserStore()
userStore.getWhere(user => user.lastName === 'Doe')
```

- `getWhereArray`: Get all the items that pass the given filter callback as an array of values
```ts
const userStore = useUserStore()
userStore.getWhereArray(user => user.lastName === 'Doe')
```
- `getIsEmpty`: Return a boolean indicating wether or not the state is empty (contains no items).
- `getIsNotEmpty`: Return a boolean indicating wether or not the state is not empty (contains items).
- `getCurrent`: current entity stored in state.
- `getActive`: array of active entities stored in state.
- `getFirstActive`: first entity get from array of active entities stored in state.
- `ìsAlreadyInStore(id: number)`: Return a boolean indicating wether or not the state contains entity.
- `isAlreadyActive(id: number)`: Return a boolean indicating wether or not the active state contains entity.
- `isDirty(id: number)`: Return a boolean indicating wether or not the entity has been modified.

## List of actions:

- `createOne`: create single entity in store
- `createMany`: Create Many entity in store
- `setCurrent`: setCurrent used entity
- `removeCurrent`: remove current used entity
- `updateOne`: update the entity in the store if it exists otherwise create the entity
- `updateMany`: update many entities in the store if they exist otherwise create them
- `deleteOne`: Delete one entity in Store
- `deleteMany`: delete many entities in Store
- `setActive`: add entity in active array
- `resetActive`: remove all active entities
- `setIsDirty(id: number)`: set $isDirty property to true to know if the entity has been modified
- `setIsNotDirty(id: number)`: set $isDirty property to false to know if the entity has been modified or not
- `updateField`: update field's value of an entity

## License

[MIT](http://opensource.org/licenses/MIT)
