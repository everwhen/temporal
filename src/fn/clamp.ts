import type { Point } from '../point.ts'

/**
 * Clamps a temporal value between a minimum and maximum bound.
 *
 * @param value - The temporal value to clamp
 * @param min - The minimum bound (inclusive)
 * @param max - The maximum bound (inclusive)
 * @returns The clamped value: `min` if value is before min, `max` if value is after max, otherwise `value`
 *
 * @example
 * ```ts
 * import { PlainDate } from '@everwhen/temporal'
 * import { clamp } from '@everwhen/temporal/fn'
 *
 * const date = PlainDate.from('2024-06-15')
 * const minDate = PlainDate.from('2024-01-01')
 * const maxDate = PlainDate.from('2024-12-31')
 *
 * clamp(date, minDate, maxDate) // 2024-06-15 (within range)
 *
 * const earlyDate = PlainDate.from('2023-06-15')
 * clamp(earlyDate, minDate, maxDate) // 2024-01-01 (clamped to min)
 *
 * const lateDate = PlainDate.from('2025-06-15')
 * clamp(lateDate, minDate, maxDate) // 2024-12-31 (clamped to max)
 * ```
 */
export function clamp<T extends Point>(value: T, min: T, max: T) {
  if (value.isBefore(min)) {
    return min
  }

  if (value.isAfter(max)) {
    return max
  }

  return value
}
