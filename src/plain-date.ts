import { Temporal } from 'temporal-polyfill'
import { Duration } from './duration.ts'
import { max, min } from './fn/index.ts'
import { PlainDateTime } from './plain-date-time.ts'
import { PlainYearMonth } from './plain-year-month.ts'
import type { MethodParameters } from './type-utils.ts'
import { ZonedDateTime } from './zoned-date-time.ts'

export type PlainDateLike = Temporal.PlainDateLike

export class PlainDate extends Temporal.PlainDate {
  static now(tzLike?: Temporal.TimeZoneLike): PlainDate {
    return PlainDate.from(Temporal.Now.plainDateISO(tzLike))
  }

  static override from(
    ...args: Parameters<typeof Temporal.PlainDate.from>
  ): PlainDate {
    const date = Temporal.PlainDate.from(...args)
    return new PlainDate(date.year, date.month, date.day, date.calendarId)
  }

  static max(...dates: PlainDate[]): PlainDate {
    return max(...dates)
  }

  static min(...dates: PlainDate[]): PlainDate {
    return min(...dates)
  }

  weekday(
    locales?: globalThis.Intl.LocalesArgument,
    format: Intl.DateTimeFormatOptions['weekday'] = 'long',
  ): string {
    return this.toLocaleString(locales, { weekday: format })
  }

  compare(other: PlainDateLike | string): Temporal.ComparisonResult {
    return PlainDate.compare(this, other)
  }

  isBefore(other: PlainDateLike) {
    return PlainDate.compare(this, other) === -1
  }

  isAfter(other: PlainDateLike) {
    return PlainDate.compare(this, other) === 1
  }

  startOfYear(): PlainDate {
    return this.with({ month: 1, day: 1 })
  }

  startOfMonth(): PlainDate {
    return this.with({ day: 1 })
  }

  startOfWeek(): PlainDate {
    const daysToSubtract =
      this.dayOfWeek === this.daysInWeek ? 0 : this.dayOfWeek

    return this.subtract({ days: daysToSubtract })
  }

  endOfYear(): PlainDate {
    return this.with({ day: this.daysInYear })
  }

  endOfMonth(): PlainDate {
    return this.with({ day: this.daysInMonth })
  }

  endOfWeek(): PlainDate {
    return this.startOfWeek().add({ days: this.daysInWeek - 1 })
  }

  override with(
    ...args: MethodParameters<Temporal.PlainDate, 'with'>
  ): PlainDate {
    return PlainDate.from(super.with(...args))
  }

  override add(
    ...args: MethodParameters<Temporal.PlainDate, 'add'>
  ): PlainDate {
    return PlainDate.from(super.add(...args))
  }

  override subtract(
    ...args: MethodParameters<Temporal.PlainDate, 'subtract'>
  ): PlainDate {
    return PlainDate.from(super.subtract(...args))
  }

  isToday(): boolean {
    return PlainDate.now().equals(this)
  }

  override toPlainYearMonth(): PlainYearMonth {
    return PlainYearMonth.from(this)
  }

  override toZonedDateTime(
    ...args: MethodParameters<Temporal.PlainDate, 'toZonedDateTime'>
  ): ZonedDateTime {
    return ZonedDateTime.from(super.toZonedDateTime(...args))
  }

  override toPlainDateTime(
    ...args: MethodParameters<Temporal.PlainDate, 'toPlainDateTime'>
  ): PlainDateTime {
    return PlainDateTime.from(super.toPlainDateTime(...args))
  }

  override withCalendar(calendar: Temporal.CalendarLike): PlainDate {
    return PlainDate.from(super.withCalendar(calendar))
  }

  override since(
    ...args: MethodParameters<Temporal.PlainDate, 'since'>
  ): Duration {
    return Duration.from(super.since(...args))
  }

  override until(
    ...args: MethodParameters<Temporal.PlainDate, 'until'>
  ): Duration {
    return Duration.from(super.until(...args))
  }
}
