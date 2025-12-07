import type { DateTimeUnit } from '../type-utils.ts'

const units: DateTimeUnit[] = [
  'year',
  'month',
  'week',
  'day',
  'hour',
  'minute',
  'second',
  'millisecond',
  'microsecond',
  'nanosecond',
] as const

/**
 * Generates temporal units from largest to smallest within a specified range.
 *
 * @param options.largest - The largest unit to start from (default: 'year')
 * @param options.smallest - The smallest unit to end at (default: 'nanosecond')
 * @throws Error if largest unit is smaller than smallest unit in the temporal hierarchy
 *
 * @example
 * // Iterate over all date units
 * for (const unit of temporalUnits({ largest: 'year', smallest: 'day' })) {
 *   console.log(unit) // 'year', 'month', 'week', 'day'
 * }
 *
 * @example
 * // Get time units as an array
 * const timeUnits = Array.from(temporalUnits({ largest: 'hour', smallest: 'millisecond' }))
 * // ['hour', 'minute', 'second', 'millisecond']
 */
export function* temporalUnits({
  largest = 'year',
  smallest = 'nanosecond',
}: {
  largest?: DateTimeUnit
  smallest?: DateTimeUnit
} = {}): Generator<DateTimeUnit> {
  const start = units.indexOf(largest)
  const end = units.indexOf(smallest)
  if (start > end) {
    throw new Error(
      `Invalid unit range: '${largest}' is smaller than '${smallest}' in the temporal hierarchy. ` +
        `The largest unit must come before or equal to the smallest unit.`,
    )
  }

  for (const unit of units.slice(start, end + 1)) {
    yield unit
  }
}
