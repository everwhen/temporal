import { Temporal } from 'temporal-polyfill'
import { Duration } from './duration.ts'
import { max, min } from './fn/index.ts'
import { PlainDateTime } from './plain-date-time.ts'
import { PlainDate } from './plain-date.ts'
import { PlainTime } from './plain-time.ts'
import type { MethodParameters } from './type-utils.ts'

export type ZonedDateTimeLike = Temporal.ZonedDateTimeLike

export class ZonedDateTime extends Temporal.ZonedDateTime {
  static now(tzLike?: Temporal.TimeZoneLike): ZonedDateTime {
    return ZonedDateTime.from(Temporal.Now.zonedDateTimeISO(tzLike))
  }

  static override from(
    ...args: Parameters<typeof Temporal.ZonedDateTime.from>
  ): ZonedDateTime {
    const date = Temporal.ZonedDateTime.from(...args)
    return new ZonedDateTime(
      date.epochNanoseconds,
      date.timeZoneId,
      date.calendarId,
    )
  }

  static max(...dates: ZonedDateTime[]): ZonedDateTime {
    return max(...dates)
  }

  static min(...dates: ZonedDateTime[]): ZonedDateTime {
    return min(...dates)
  }

  compare(other: ZonedDateTimeLike | string): Temporal.ComparisonResult {
    return ZonedDateTime.compare(this, other)
  }

  isBefore(other: ZonedDateTimeLike): boolean {
    return ZonedDateTime.compare(this, other) === -1
  }

  isAfter(other: ZonedDateTimeLike): boolean {
    return this.compare(other) === 1
  }

  override startOfDay(): ZonedDateTime {
    return ZonedDateTime.from(super.startOfDay())
  }

  startOfYear(): ZonedDateTime {
    return ZonedDateTime.from(this.with({ month: 1, day: 1 }))
  }

  startOfMonth(): ZonedDateTime {
    return ZonedDateTime.from(this.with({ day: 1 }))
  }

  startOfWeek(): ZonedDateTime {
    const daysToSubtract =
      this.dayOfWeek === this.daysInWeek ? 0 : this.dayOfWeek

    return ZonedDateTime.from(this.subtract({ days: daysToSubtract }))
  }

  endOfYear(): ZonedDateTime {
    return ZonedDateTime.from(this.with({ month: this.monthsInYear, day: 1 }))
  }

  endOfMonth(): ZonedDateTime {
    return ZonedDateTime.from(this.with({ day: this.daysInMonth }))
  }

  endOfWeek(): ZonedDateTime {
    return ZonedDateTime.from(
      this.startOfWeek().add({ days: this.daysInWeek - 1 }),
    )
  }

  override add(
    ...args: MethodParameters<Temporal.ZonedDateTime, 'add'>
  ): ZonedDateTime {
    return ZonedDateTime.from(super.add(...args))
  }

  override subtract(
    ...args: MethodParameters<Temporal.ZonedDateTime, 'subtract'>
  ): ZonedDateTime {
    return ZonedDateTime.from(super.subtract(...args))
  }

  override with(
    ...args: MethodParameters<Temporal.ZonedDateTime, 'with'>
  ): ZonedDateTime {
    return ZonedDateTime.from(super.with(...args))
  }

  override withCalendar(calendar: Temporal.CalendarLike): ZonedDateTime {
    return ZonedDateTime.from(super.withCalendar(calendar))
  }

  override withPlainTime(
    ...args: MethodParameters<Temporal.ZonedDateTime, 'withPlainTime'>
  ): ZonedDateTime {
    return ZonedDateTime.from(super.withPlainTime(...args))
  }

  override withTimeZone(timeZone: Temporal.TimeZoneLike): ZonedDateTime {
    return ZonedDateTime.from(super.withTimeZone(timeZone))
  }

  override round(
    ...args: MethodParameters<Temporal.ZonedDateTime, 'round'>
  ): ZonedDateTime {
    return ZonedDateTime.from(super.round(...args))
  }

  override since(
    ...args: MethodParameters<Temporal.ZonedDateTime, 'since'>
  ): Duration {
    return Duration.from(super.since(...args))
  }

  override until(
    ...args: MethodParameters<Temporal.ZonedDateTime, 'until'>
  ): Duration {
    return Duration.from(super.until(...args))
  }

  override toPlainDate(): PlainDate {
    return PlainDate.from(super.toPlainDate())
  }

  override toPlainDateTime(): PlainDateTime {
    return PlainDateTime.from(super.toPlainDateTime())
  }

  override toPlainTime(): PlainTime {
    return PlainTime.from(super.toPlainTime())
  }
}
