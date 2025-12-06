import type { Point } from '../point.ts'

/**
 * Returns the latest (maximum) temporal value from the provided values.
 *
 * @param values - One or more temporal values of the same type to compare
 * @returns The latest temporal value
 *
 * @example
 * ```ts
 * import { PlainDate } from '@everwhen/temporal'
 * import { max } from '@everwhen/temporal/fn'
 *
 * const dates = [
 *   PlainDate.from('2024-03-15'),
 *   PlainDate.from('2024-01-01'),
 *   PlainDate.from('2024-06-30'),
 * ]
 *
 * max(...dates) // 2024-06-30
 * ```
 *
 * @example
 * ```ts
 * import { PlainDateTime } from '@everwhen/temporal'
 * import { max } from '@everwhen/temporal/fn'
 *
 * max(
 *   PlainDateTime.from('2024-01-01T10:00'),
 *   PlainDateTime.from('2024-01-01T15:30'),
 *   PlainDateTime.from('2024-01-01T08:45'),
 * ) // 2024-01-01T15:30
 * ```
 */
export function max<T extends Point>(...values: T[]): T {
  let max = values[0] as T
  for (const value of values) {
    max = value.compare(max) > 0 ? value : max
  }
  return max
}
