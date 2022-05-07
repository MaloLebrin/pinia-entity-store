/**
 * Returns the object type of the given value.
 *
 * @param value
 * @returns string
 */
export function getType<T>(value: T): string {
  return Object.prototype.toString.call(value).slice(8, -1)
}

/**
 * Returns true if `value` is a number.
 *
 * @param value any
 * @returns `true` || `false`
 */
export function isNumber(value: any): value is number {
  return getType(value) === 'Number'
}
