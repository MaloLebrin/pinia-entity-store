import { BaseEntity, State } from "../types";

export default function <T>(entity: BaseEntity<T>): State<T> {
	return {
		entities: {
			byId: {},
			allIds: [],
			current: null
		},
	}
}
