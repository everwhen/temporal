import { PlainYearMonth } from '../plain-year-month.ts'
import { Sequence } from '../sequence.ts'

export function calendarYear(): Sequence<PlainYearMonth> {
  const now = PlainYearMonth.now()
  const start = now.with({ year: now.year, month: 1 })
  const end = now.with({
    year: now.year,
    month: now.monthsInYear,
  })

  return Sequence.from({ start, end })
}
