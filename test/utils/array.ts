import { getType, isNumber } from './basics'

/**
 * Returns true if `value` is an array of numbers.
 *
 * @param value any
 * @returns `true` || `false`
 */
export function isArrayOfNumbers(value: any): boolean {
  if (!isArray(value) || !value.length)
    return false
  return value.every(i => isNumber(i))
}

/**
 * Returns true if `value` is an array.
 *
 * @param value any
 * @returns `true` || `false`
 */
export function isArray(value: any): value is any[] {
  return getType(value) === 'Array'
}
