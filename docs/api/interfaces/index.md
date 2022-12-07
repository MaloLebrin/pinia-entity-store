# Interfaces


## State

state create by createState function looks like this
```ts
export interface State<T> {
  entities: {
    byId: Record<Id, T & { $isDirty: boolean }>
    allIds: Id[]
    current: T & { $isDirty: boolean } | null
    active: Id[]
  }
}
```
::: tip
`$isDirty` property is added to each entity, when the entity is created
:::


## WithId

```ts
export interface WithId {
  id: Id
}
```

## ByIdParams

```ts
export interface ByIdParams<T> {
  id: Id
  payload: T
}
```
