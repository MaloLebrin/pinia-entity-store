import { schema } from "normalizr"
import { BaseEntity } from '../types'

export default function createEntity<T>(path: string): BaseEntity<T> {

	const mutationPrefix = path.toUpperCase() + '_'
	const actionPrefix = path
	const singleSchema = new schema.Entity<T>(path)
	const multipleSchema = new schema.Array<T>(singleSchema)

	return {
		path,
		mutationPrefix,
		actionPrefix,
		singleSchema,
		multipleSchema,
	}
}
