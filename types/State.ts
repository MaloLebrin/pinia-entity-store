export type State<T> = {
	entities: {
		byId: Record<number, T>,
		allIds: number[],
		current: T | null,
	}
}
