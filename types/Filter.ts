export type FilterFn<T> = (item: T) => boolean | null

export type OptionalFilterFn<T> = FilterFn<T> | null
