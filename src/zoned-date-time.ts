import { Temporal } from 'temporal-polyfill'
import { toLocale } from './common.js'
import { Duration } from './duration.js'
import { PlainDateTime } from './plain-date-time.js'
import { PlainDate } from './plain-date.js'
import { PlainTime } from './plain-time.js'
import { PlainYearMonth } from './plain-year-month.js'

export type ZonedDateTimeLike =
	| ZonedDateTime
	| Temporal.ZonedDateTime
	| Temporal.ZonedDateTimeLike

export class ZonedDateTime extends Temporal.ZonedDateTime {
	static now() {
		return ZonedDateTime.from(Temporal.Now.zonedDateTimeISO())
	}

	static from(
		item: ZonedDateTimeLike | string,
		options?: Temporal.ZonedDateTimeAssignmentOptions,
	): ZonedDateTime {
		const date = Temporal.ZonedDateTime.from(item, options)
		return new ZonedDateTime(
			date.epochNanoseconds,
			date.timeZoneId,
			date.calendarId,
		)
	}

	compare(other: ZonedDateTimeLike | string): Temporal.ComparisonResult {
		return ZonedDateTime.compare(this, other)
	}

	startOfDay(): ZonedDateTime {
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

	nextMonth(): ZonedDateTime {
		return ZonedDateTime.from(this.add({ months: 1 }).with({ day: 1 }))
	}

	previousMonth(): ZonedDateTime {
		return ZonedDateTime.from(this.subtract({ months: 1 }).with({ day: 1 }))
	}

	nextWeek(): ZonedDateTime {
		return ZonedDateTime.from(this.startOfWeek().add({ weeks: 1 }))
	}

	nextDay(): ZonedDateTime {
		return this.add({ days: 1 })
	}

	add(
		durationLike: Temporal.Duration | Temporal.DurationLike | string,
		options?: Temporal.ArithmeticOptions,
	): ZonedDateTime {
		return ZonedDateTime.from(super.add(durationLike, options))
	}

	subtract(
		durationLike: Temporal.Duration | Temporal.DurationLike | string,
		options?: Temporal.ArithmeticOptions,
	): ZonedDateTime {
		return ZonedDateTime.from(super.subtract(durationLike, options))
	}

	isBefore(other: ZonedDateTimeLike): boolean {
		return ZonedDateTime.compare(this, other) === -1
	}

	isAfter(other: ZonedDateTimeLike): boolean {
		return this.compare(other) === 1
	}

	isToday(): boolean {
		const now = Temporal.Now.plainDateISO()
		return now.equals(this)
	}

	with(
		zonedDateTimeLike: Temporal.ZonedDateTimeLike,
		options?: Temporal.ZonedDateTimeAssignmentOptions,
	): ZonedDateTime {
		return ZonedDateTime.from(super.with(zonedDateTimeLike, options))
	}

	withCalendar(calendar: Temporal.CalendarLike): ZonedDateTime {
		return ZonedDateTime.from(super.withCalendar(calendar))
	}

	withPlainTime(
		timeLike?: PlainTime | Temporal.PlainTime | Temporal.PlainTimeLike | string,
	): ZonedDateTime {
		return ZonedDateTime.from(super.withPlainTime(timeLike))
	}

	withPlainDate(
		dateLike: PlainDate | Temporal.PlainDate | Temporal.PlainDateLike | string,
	): ZonedDateTime {
		return ZonedDateTime.from(super.withPlainDate(dateLike))
	}

	withTimeZone(timeZone: Temporal.TimeZoneLike): ZonedDateTime {
		return ZonedDateTime.from(super.withTimeZone(timeZone))
	}

	round(
		roundTo: Temporal.RoundTo<
			| 'day'
			| 'hour'
			| 'minute'
			| 'second'
			| 'millisecond'
			| 'microsecond'
			| 'nanosecond'
		>,
	): ZonedDateTime {
		return ZonedDateTime.from(super.round(roundTo))
	}

	since(
		other: ZonedDateTimeLike,
		options?: Temporal.DifferenceOptions<
			| 'year'
			| 'month'
			| 'week'
			| 'day'
			| 'hour'
			| 'minute'
			| 'second'
			| 'millisecond'
			| 'microsecond'
			| 'nanosecond'
		>,
	): Duration {
		return Duration.from(super.since(other, options))
	}

	until(
		other: ZonedDateTimeLike,
		options?: Temporal.DifferenceOptions<
			| 'year'
			| 'month'
			| 'week'
			| 'day'
			| 'hour'
			| 'minute'
			| 'second'
			| 'millisecond'
			| 'microsecond'
			| 'nanosecond'
		>,
	): Duration {
		return Duration.from(super.until(other, options))
	}

	toPlainYearMonth(): PlainYearMonth {
		return PlainYearMonth.from(super.toPlainYearMonth())
	}

	toPlainDate(): PlainDate {
		return PlainDate.from(super.toPlainDate())
	}

	toLocaleString(
		localesOrOptions?: string | string[] | Intl.DateTimeFormatOptions,
		formatOptions?: Intl.DateTimeFormatOptions,
	): string {
		const { locale, options } = toLocale(localesOrOptions, formatOptions)
		return super.toLocaleString(locale, options)
	}

	toPlainDateTime(): PlainDateTime {
		return PlainDateTime.from(super.toPlainDateTime())
	}

	toPlainTime(): PlainTime {
		return PlainTime.from(super.toPlainTime())
	}
}
