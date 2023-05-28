# Actions

## CreateOne
▸ **createOne**(`entity: T`): `void`
Add the entity received as arguments in the store
#### Returns
`void`

**`Example`**

```ts
const { createOne } = useUserStore()
createOne({
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
})
```
::: tip
the entity is added to the store only if it is not already present in the store
:::

## CreateMany
▸ **createMany**(`entity: T[]`): `void`
Add an array of entities received as arguments in the store
#### Returns
`void`

**`Example`**

```ts
const { createMany } = useUserStore()
createMany([
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
::: tip
are added to the store only entities that are not already present in the store
:::
## UpdateOne
▸ **updateOne**(`id: string | null, payload: T`): `void`
update the entity received as arguments in the store based on his id
#### Returns
`void`

**`Example`**

```ts
const { updateOne } = useUserStore()
updateOne(1, {
  id: 1,
  firstName: 'Antony',
  lastName: 'Doe',
})
```
::: tip
the entity is updated to the store only if it is already present in the store otherwise the entity is created
:::

## UpdateMany
▸ **UpdateMany**(`entity: T[]`): `void`
update all entities in the array received as arguments in the store
#### Returns
`void`

**`Example`**

```ts
const { updateMany } = useUserStore()
updateMany([
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
::: tip
Each entity in the array is updated to the store only if it is already present in the store otherwise the entity is created
:::


## DeleteOne

▸ **deleteOne**(`id: string | number`): `void`
delete entity in the store based in his id
#### Returns
`void`

**`Example`**

```ts
const { deleteOne } = useUserStore()
deleteOne(1)
```
## DeleteMany

▸ **deleteMany**(`id: string | number []`): `void`
delete entities in the store
#### Returns
`void`

**`Example`**

```ts
const { deleteMany } = useUserStore()
deleteMany([1, 2, 3])
```

## UpdateField

▸ **updateField**(`(field: K, value: T[K], id: string | number)`): `void`

update field's value of an entity
#### Returns
`void`

**`Example`**

```ts
const { updateField } = useUserStore()
updateField('firstName', 'Malo', 1)
```

## SetIsDirty

▸ **setIsDirty**(`id: string | number)`): `void`

set `$isDirty` property of an entity to `true` to know if the entity has been modified or not
#### Returns
`void`

**`Example`**

```ts
const { setIsDirty } = useUserStore()
setIsDirty(1)
```
## SetIsNotDirty

▸ **setIsNotDirty**(`id: string | number`): `void`

set `$isDirty` property of an entity to `false` to know if the entity has been modified or not
#### Returns
`void`

**`Example`**

```ts
const { setIsNotDirty } = useUserStore()
setIsNotDirty(1)
```

## SetCurrent

▸ **setCurrent**(`entity: T`): `void`

setCurrent used entity
#### Returns
`void`

**`Example`**

```ts
const { setCurrent } = useUserStore()
setCurrent({
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
})
```

## RemoveCurrent

▸ **removeCurrent**(): `void`

removeCurrent used entity
#### Returns
`void`

**`Example`**

```ts
const { removeCurrent } = useUserStore()
removeCurrent()
```


## SetActive

▸ **setActive**(`id: string | number`): `void`

Push id of an entity to an array of active enties
#### Returns
`void`

**`Example`**

```ts
const { setActive } = useUserStore()
setActive(1)
```
::: tip
Push id of an entity to an array of active enties only if it is not already present in the store
:::


## ResetActive

▸ **resetActive**(): `void`

empty the array of active entities
#### Returns
`void`

**`Example`**

```ts
const { resetActive } = useUserStore()
resetActive()
```
