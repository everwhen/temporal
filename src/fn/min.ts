import type { Point } from '../point.ts'

/**
 * Returns the earliest (minimum) temporal value from the provided values.
 *
 * @param values - One or more temporal values of the same type to compare
 * @returns The earliest temporal value
 *
 * @example
 * ```ts
 * import { PlainDate } from '@everwhen/temporal'
 * import { min } from '@everwhen/temporal/fn'
 *
 * const dates = [
 *   PlainDate.from('2024-03-15'),
 *   PlainDate.from('2024-01-01'),
 *   PlainDate.from('2024-06-30'),
 * ]
 *
 * min(...dates) // 2024-01-01
 * ```
 *
 * @example
 * ```ts
 * import { PlainTime } from '@everwhen/temporal'
 * import { min } from '@everwhen/temporal/fn'
 *
 * min(
 *   PlainTime.from('14:30'),
 *   PlainTime.from('09:15'),
 *   PlainTime.from('18:00'),
 * ) // 09:15
 * ```
 */
export function min<T extends Point>(...values: T[]): T {
  let min = values[0] as T
  for (const value of values) {
    min = value.compare(min) < 0 ? value : min
  }

  return min
}
