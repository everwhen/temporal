import { Temporal } from 'temporal-polyfill'
import { toLocale } from './common.js'
import { Duration, type DurationLike } from './duration.js'
import { PlainDate, type PlainDateLike } from './plain-date.js'
import { PlainTime, type PlainTimeLike } from './plain-time.js'
import { PlainYearMonth } from './plain-year-month.js'
import { ZonedDateTime } from './zoned-date-time.js'

export type PlainDateTimeLike =
	| PlainDateTime
	| Temporal.PlainDateTime
	| Temporal.PlainDateTimeLike

export class PlainDateTime extends Temporal.PlainDateTime {
	static now() {
		return PlainDateTime.from(Temporal.Now.plainDateTimeISO())
	}

	static from(
		item: PlainDateTimeLike | string,
		options?: Temporal.AssignmentOptions,
	): PlainDateTime {
		const date = Temporal.PlainDateTime.from(item, options)
		return new PlainDateTime(
			date.year,
			date.month,
			date.day,
			date.hour,
			date.minute,
			date.second,
			date.millisecond,
			date.microsecond,
			date.nanosecond,
			date.calendarId,
		)
	}

	compare(other: PlainDateTimeLike | string): Temporal.ComparisonResult {
		return PlainDateTime.compare(this, other)
	}

	isBefore(other: PlainDateTimeLike): boolean {
		return PlainDateTime.compare(this, other) === -1
	}

	isAfter(other: PlainDateTimeLike): boolean {
		return PlainDateTime.compare(this, other) === 1
	}

	startOfYear(): PlainDateTime {
		return this.with({ month: 1, day: 1 })
	}

	startOfMonth(): PlainDateTime {
		return this.with({ day: 1 })
	}

	startOfWeek(): PlainDateTime {
		const daysToSubtract =
			this.dayOfWeek === this.daysInWeek ? 0 : this.dayOfWeek

		return this.subtract({ days: daysToSubtract })
	}

	endOfYear(): PlainDateTime {
		return this.with({ day: this.daysInYear })
	}

	endOfMonth(): PlainDateTime {
		return this.with({ day: this.daysInMonth })
	}

	endOfWeek(): PlainDateTime {
		return this.startOfWeek().add({ days: this.daysInWeek - 1 })
	}

	subtract(
		durationLike: DurationLike | string,
		options?: Temporal.ArithmeticOptions,
	): PlainDateTime {
		return PlainDateTime.from(super.subtract(durationLike, options))
	}

	add(
		durationLike: DurationLike | string,
		options?: Temporal.ArithmeticOptions,
	): PlainDateTime {
		return PlainDateTime.from(super.add(durationLike, options))
	}

	since(
		other: PlainDateTimeLike | string,
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
		other: PlainDateTimeLike | string,
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
	): PlainDateTime {
		return PlainDateTime.from(super.round(roundTo))
	}

	toPlainDate(): PlainDate {
		return PlainDate.from(this)
	}

	toPlainTime(): PlainTime {
		return PlainTime.from(this)
	}

	toZonedDateTime(
		tzLike: Temporal.TimeZoneLike,
		options?: Temporal.ToInstantOptions,
	): ZonedDateTime {
		return ZonedDateTime.from(super.toZonedDateTime(tzLike, options))
	}

	toPlainYearMonth(): PlainYearMonth {
		return PlainYearMonth.from(this)
	}

	toLocaleString(
		localesOrOptions?: string | string[] | Intl.DateTimeFormatOptions,
		formatOptions?: Intl.DateTimeFormatOptions,
	): string {
		const { locale, options } = toLocale(localesOrOptions, formatOptions)
		return super.toLocaleString(locale, options)
	}

	withPlainDate(dateLike: PlainDateLike | string): PlainDateTime {
		return PlainDateTime.from(super.withPlainDate(dateLike))
	}

	withPlainTime(timeLike?: PlainTimeLike | string): PlainDateTime {
		return PlainDateTime.from(super.withPlainTime(timeLike))
	}

	withCalendar(calendar: Temporal.CalendarLike): PlainDateTime {
		return PlainDateTime.from(super.withCalendar(calendar))
	}

	with(
		dateTimeLike: Temporal.PlainDateTimeLike,
		options?: Temporal.AssignmentOptions,
	): PlainDateTime {
		return PlainDateTime.from(super.with(dateTimeLike, options))
	}
}
