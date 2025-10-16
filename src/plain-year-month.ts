import { Temporal } from 'temporal-polyfill'
import { Duration } from './duration.ts'
import { max, min } from './fn/index.ts'
import { PlainDate } from './plain-date.ts'
import type { MethodParameters } from './type-utils.ts'

export type PlainYearMonthLike = Temporal.PlainYearMonthLike

export class PlainYearMonth extends Temporal.PlainYearMonth {
  static now(): PlainYearMonth {
    return PlainYearMonth.from(PlainDate.now())
  }

  static override from(
    ...args: Parameters<typeof Temporal.PlainYearMonth.from>
  ): PlainYearMonth {
    const month = Temporal.PlainYearMonth.from(...args)
    return new PlainYearMonth(month.year, month.month)
  }

  static max(...dates: PlainYearMonth[]): PlainYearMonth {
    return max(...dates)
  }

  static min(...dates: PlainYearMonth[]): PlainYearMonth {
    return min(...dates)
  }

  compare(other: PlainYearMonthLike | string): Temporal.ComparisonResult {
    return PlainYearMonth.compare(this, other)
  }

  /**
   * Compares two PlainYearMonth objects.
   * Comparison is based on the first day of the month in the real world, regardless of the calendar.
   *
   * @link https://tc39.es/proposal-temporal/docs/plainyearmonth.html#compare
   */
  isBefore(other: PlainYearMonthLike): boolean {
    return PlainYearMonth.compare(this, other) === -1
  }

  /**
   * Compares two PlainYearMonth objects.
   * Comparison is based on the first day of the month in the real world, regardless of the calendar.
   *
   * @link https://tc39.es/proposal-temporal/docs/plainyearmonth.html#compare
   */
  isAfter(other: PlainYearMonthLike): boolean {
    return PlainYearMonth.compare(this, other) === 1
  }

  override add(
    ...args: MethodParameters<Temporal.PlainYearMonth, 'add'>
  ): PlainYearMonth {
    return PlainYearMonth.from(super.add(...args))
  }

  override subtract(
    ...args: MethodParameters<Temporal.PlainYearMonth, 'subtract'>
  ): PlainYearMonth {
    return PlainYearMonth.from(super.subtract(...args))
  }

  contains(date: PlainYearMonthLike): boolean {
    return (
      PlainYearMonth.compare(this, date) <= 0 &&
      PlainYearMonth.compare(this, date) >= 0
    )
  }

  startOfMonth(): PlainDate {
    return this.toPlainDate({ day: 1 })
  }

  endOfMonth(): PlainDate {
    return this.toPlainDate({ day: this.toPlainDate().daysInMonth })
  }

  override toPlainDate(day?: { day: number }): PlainDate {
    const opts = day ? day : { day: 1 }
    return PlainDate.from(super.toPlainDate(opts))
  }

  override with(...args: MethodParameters<Temporal.PlainYearMonth, 'with'>) {
    return PlainYearMonth.from(super.with(...args))
  }

  override until(
    ...args: MethodParameters<Temporal.PlainYearMonth, 'until'>
  ): Duration {
    return Duration.from(super.until(...args))
  }

  override since(
    ...args: MethodParameters<Temporal.PlainYearMonth, 'since'>
  ): Duration {
    return Duration.from(super.since(...args))
  }
}
