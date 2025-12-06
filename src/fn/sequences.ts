import { PlainYearMonth } from '../plain-year-month.ts'
import { Sequence } from '../sequence.ts'

/**
 * Creates a sequence of all months in the current calendar year.
 *
 * @returns A `Sequence<PlainYearMonth>` from January to December of the current year
 *
 * @example
 * ```ts
 * import { sequences } from '@everwhen/temporal/fn'
 *
 * // Iterate over all months in the current year
 * for (const month of sequences.calendarYear()) {
 *   console.log(month.toString()) // 2024-01, 2024-02, ..., 2024-12
 * }
 * ```
 *
 * @example
 * ```ts
 * import { sequences } from '@everwhen/temporal/fn'
 *
 * // Get all months as an array
 * const months = [...sequences.calendarYear()]
 *
 * // Map to month names
 * const monthNames = sequences.calendarYear().map((m) =>
 *   m.toLocaleString('en-US', { month: 'long' })
 * )
 * ```
 */
export function calendarYear(): Sequence<PlainYearMonth> {
  const now = PlainYearMonth.now()
  const start = now.with({ year: now.year, month: 1 })
  const end = now.with({
    year: now.year,
    month: now.monthsInYear,
  })

  return Sequence.from({ start, end })
}
