import { State, WithId } from "../types";

export default function createGetters<T extends WithId>(state: State<T>) {
	/**
	 * Get a single item from the state by its id.
	 * @param id - The id of the item
	 */
	function findOneById() {
		return (id: number) => state.entities.byId[id]
	}

	/**
	 * Get multiple itesm from the state by their ids.
	 * @param ids - The ids of items
	 */
	function findManyById() {
		return (ids: number[]) => ids.map(id => state.entities.byId[id])
	}

	/**
	 * Get all the items from the state as a dictionnary of values.
	 */
	function getAll() {
		return state.entities.byId
	}

	/**
	 * Get all items from the state as an array of values.
	 */
	function getAllArray() {
		return Object.values(state.entities.byId)
	}

	/**
	 * Get an array containing the ids of all the items in the state.
	 */
	function getAllIds() {
		return state.entities.allIds
	}

	/**
	 * Get all the items that pass the given filter callback as a dictionnary of values.
	 * @param filter - The filtering callback that will be used to filter the items.
	 */
	function getWhere() {
		return (filter: (arg: T) => boolean | null) => {
			if (typeof filter !== 'function') {
				return state.entities.byId
			}
			return state.entities.allIds.reduce((acc: Record<number, T>, id: number) => {
				const item = state.entities.byId[id]
				if (!filter(item)) {
					return acc
				}
				acc[id] = item
				return acc
			}, {} as Record<number, T>)
		}
	}

	/**
	 * Get all the items that pass the given filter callback as an array of values.
	 * @param filter - The filtering callback that will be used to filter the items.
	 */
	function getWhereArray() {
		return (filter: (arg: T) => boolean | null) => {
			if (typeof filter !== 'function') {
				return Object.values(state.entities.byId)
			}
			return Object.values(state.entities.allIds.reduce((acc: Record<number, T>, id: number) => {
				const item = state.entities.byId[id]
				if (!filter(item)) {
					return acc
				}
				acc[id] = item
				return acc
			}, {} as Record<number, T>))
		}
	}

	/**
	 * Returns a boolean indicating wether or not the state is empty (contains no items).
	 */
	function getIsEmpty() {
		return state.entities.allIds.length === 0
	}

	/**
	 * Returns a boolean indicating wether or not the state is not empty (contains items).
	*/
	function getIsNotEmpty() {
		return state.entities.allIds.length > 0
	}

	function getCurrent() {
		return state.entities.current
	}

	return {
		findOneById,
		findManyById,
		getAll,
		getAllArray,
		getAllIds,
		getWhere,
		getWhereArray,
		getIsEmpty,
		getIsNotEmpty,
		getCurrent,
	}
}