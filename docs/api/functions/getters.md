# Getters

## GetOne
▸ **getOne**(`id: string | number`): `T | null`

return the entity received based on id passed in argument
#### Returns
`entity: T | null`

**`Example`**

```ts
const userStore = useUserStore()
userStore.getOne(1)
```
## GetMany
▸ **getMany**(`id: string | null[]`): `T[] | null`

return entities received based on id passed in argument
#### Returns
`entity: T[] | null`

**`Example`**

```ts
const userStore = useUserStore()
userStore.getMany([1, 2, 3])
```

## GetAll

▸ **getAll**: `Record<number, Entity>`

return all entities in store
#### Returns
`Record<number, Entity>`

**`Example`**

```ts
const userStore = useUserStore()
userStore.getAll
```

## GetAllArray

▸ **getAllArray**: `Entity[]`

return an array of all entities in store
#### Returns
`Entity[]`

**`Example`**

```ts
const userStore = useUserStore()
userStore.getAllArray
```

## GetAllIds

▸ **getAllIds**: `string | number[]`

return all ids for entities in the store as number[]
#### Returns
`string | number[]`

**`Example`**

```ts
const userStore = useUserStore()
userStore.getAllIds
```

## GetMissingsIds

▸ **getMissingsIds**(`ids: string | number[], canHaveDuplicates?: boolean`): `string | number[]`

returns a list of missing IDs in the store compared to the ids passed to the getter. with an option to filter out duplicates
#### Returns
`string | number[]`

**`Example`**

```ts
const userStore = useUserStore()
userStore.getMissingIds([1, 2, 3])
```
::: tip
Be default the function will return uniq ids
:::



## GetMissingsEntities

▸ **getMissingsEntities**(`entities: T[]`): `T[]`

returns a list of missing entities in the store compared to the entities passed to the getter.
#### Returns
`T[]`

**`Example`**

```ts
const userStore = useUserStore()
userStore.getMissingsEntities([
  {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  },
  {
  id: 2,
  firstName: 'Jane',
  lastName: 'Doe',
  },
])
```

## GetWhere

▸ **getWhere**(`filter: (arg: T) => boolean | null`): `Record<string | number, T>`

Get all the items that pass the given filter callback as a dictionnary of values.
#### Returns
`Record<string | number, T>`

**`Example`**

```ts
const userStore = useUserStore()
userStore.getWhere(user => user.id === 1)
```

## GetWhereArray

▸ **getWhereArray**(`filter: (arg: T) => boolean | null`): `T[]`

Get all the items that pass the given filter callback as an array of values
#### Returns
`T[]`

**`Example`**

```ts
const userStore = useUserStore()
userStore.getWhereArray(user => user.id === 1)
```

## GetIsEmpty

▸ **getIsEmpty**(): `boolean`

Returns a boolean indicating wether or not the state is empty (contains no items).
#### Returns
`boolean`

**`Example`**

```ts
const userStore = useUserStore()
userStore.getIsEmpty
```

## GetIsNotEmpty

▸ **getIsNotEmpty**(): `boolean`

Returns a boolean indicating wether or not the state is not empty (contains items).
#### Returns
`boolean`

**`Example`**

```ts
const userStore = useUserStore()
userStore.getIsNotEmpty
```

## GetCurrent

▸ **getCurrent**(): `T | null`

current entity stored in state
#### Returns
`T | null`

**`Example`**

```ts
const userStore = useUserStore()
userStore.getCurrent
```

## GetActive

▸ **getActive**(): `string | null []`

Array of active entities stored in state
#### Returns
`string | null []`

**`Example`**

```ts
const userStore = useUserStore()
userStore.getActive
```

## GetFirstActive

▸ **getFirstActive**(): `T | null`

first entity get from array of active entities stored in state
#### Returns
`T | null`

**`Example`**

```ts
const userStore = useUserStore()
userStore.getFirstActive
```

## IsAlreadyInStore

▸ **isAlreadyInStore**(`id: string | number`): `boolean`

Return a boolean indicating wether or not the state contains entity.
#### Returns
`boolean`

**`Example`**

```ts
const userStore = useUserStore()
userStore.isAlreadyInStore(1)
```

## IsAlreadyActive

▸ **isAlreadyActive**(`id: string | number`): `boolean`

Return a boolean indicating wether or not the active state contains entity.
#### Returns
`boolean`

**`Example`**

```ts
const userStore = useUserStore()
userStore.isAlreadyActive(1)
```

## IsDirty

▸ **isDirty**(`id: string | number`): `boolean`

Return a boolean indicating wether or not the entity has been modified.
#### Returns
`boolean`

**`Example`**

```ts
const userStore = useUserStore()
userStore.isDirty(1)
```
