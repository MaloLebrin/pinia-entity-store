# Actions (Setters)

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
