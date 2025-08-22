export interface WithId {
  id: Id
}

export type Id = number | string

export interface State<T> {
  entities: {
    byId: Record<Id, T & { $isDirty: boolean }>
    allIds: Id[]
    current: T & { $isDirty: boolean } | null
    currentById: Id | null
    active: Id[]
  }
}

export interface ByIdParams {
  id: Id
}

export interface FilterFn<T> {
  (entity: T): boolean
}

export interface OptionalFilterFn<T> {
  (entity: T): boolean | null
}

// Configuration options for entity store
export interface EntityStoreConfig<T> {
  // Custom validation for entities
  validateEntity?: (entity: T) => boolean | string
  // Custom hooks for entity lifecycle
  onEntityCreated?: (entity: T) => void
  onEntityUpdated?: (entity: T, previousEntity: T) => void
  onEntityDeleted?: (entity: T) => void
  // Custom dirty state management
  customDirtyCheck?: (entity: T) => boolean
  // Custom ID generation
  generateId?: () => Id
}

// Entity store interface for adapters
export interface EntityStore<T> {
  // State management
  getState(): State<T>
  setState(newState: Partial<State<T>>): void
  
  // Actions
  createOne(entity: T): void
  createMany(entities: T[]): void
  updateOne(id: Id, updates: Partial<T>): void
  updateMany(entities: T[]): void
  deleteOne(id: Id): void
  deleteMany(ids: Id[]): void
  setCurrent(entity: T): void
  removeCurrent(): void
  setCurrentById(id: Id): void
  removeCurrentById(): void
  setActive(id: Id): void
  resetActive(): void
  setIsDirty(id: Id): void
  setIsNotDirty(id: Id): void
  updateField<K extends keyof T>(field: K, value: T[K], id: Id): void
  
  // Getters
  getOne(id: Id): (T & { $isDirty: boolean }) | undefined
  getMany(ids: Id[]): (T & { $isDirty: boolean })[]
  getAll(): Record<Id, T & { $isDirty: boolean }>
  getAllArray(): (T & { $isDirty: boolean })[]
  getAllIds(): Id[]
  getCurrent(): (T & { $isDirty: boolean }) | null
  getCurrentById(): (T & { $isDirty: boolean }) | null
  getActive(): Id[]
  getFirstActive(): Id | undefined
  getWhere(filter: FilterFn<T>): Record<Id, T & { $isDirty: boolean }>
  getWhereArray(filter: FilterFn<T>): (T & { $isDirty: boolean })[]
  getFirstWhere(filter: FilterFn<T>): (T & { $isDirty: boolean }) | undefined
  getIsEmpty(): boolean
  getIsNotEmpty(): boolean
  getMissingIds(ids: Id[], canHaveDuplicates?: boolean): Id[]
  getMissingEntities(entities: T[]): T[]
  isAlreadyInStore(id: Id): boolean
  isAlreadyActive(id: Id): boolean
  isDirty(id: Id): boolean
  search(field: string): (T & { $isDirty: boolean })[]
}
