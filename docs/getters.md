# Getters

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
