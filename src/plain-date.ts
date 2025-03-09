import { Temporal } from 'temporal-polyfill'
import { toLocale } from './common.js'
import { Duration } from './duration.js'
import { PlainDateTime } from './plain-date-time.js'
import { PlainYearMonth } from './plain-year-month.js'
import { ZonedDateTime } from './zoned-date-time.js'

export type PlainDateLike =
	| PlainDate
	| Temporal.PlainDate
	| Temporal.PlainDateLike

export class PlainDate extends Temporal.PlainDate {
	static now() {
		return PlainDate.from(Temporal.Now.plainDateISO())
	}

	static from(...args: Parameters<typeof Temporal.PlainDate.from>): PlainDate {
		const date = Temporal.PlainDate.from(...args)
		return new PlainDate(date.year, date.month, date.day, date.calendarId)
	}

	weekday(
		localesOrOptions?: string | string[] | Intl.DateTimeFormatOptions,
		format: Intl.DateTimeFormatOptions['weekday'] = 'long',
	): string {
		return this.toLocaleString(localesOrOptions, { weekday: format })
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

	with(dateLike: Temporal.PlainDateLike, options?: Temporal.AssignmentOptions) {
		return PlainDate.from(super.with(dateLike, options))
	}

	add(
		durationLike: Temporal.Duration | Temporal.DurationLike | string,
		options?: Temporal.ArithmeticOptions,
	) {
		return PlainDate.from(super.add(durationLike, options))
	}

	subtract(
		durationLike: Temporal.Duration | Temporal.DurationLike | string,
		options?: Temporal.ArithmeticOptions,
	) {
		return PlainDate.from(super.subtract(durationLike, options))
	}

	isToday() {
		return PlainDate.now().equals(this)
	}

	toPlainYearMonth() {
		return PlainYearMonth.from(this)
	}

	toLocaleString(
		localesOrOptions?: string | string[] | Intl.DateTimeFormatOptions,
		formatOptions?: Intl.DateTimeFormatOptions,
	): string {
		const { locale, options } = toLocale(localesOrOptions, formatOptions)
		return super.toLocaleString(locale, options)
	}

	toZonedDateTime(
		timeZoneAndTime:
			| Temporal.TimeZoneProtocol
			| string
			| {
					timeZone: Temporal.TimeZoneLike
					plainTime?: Temporal.PlainTime | Temporal.PlainTimeLike | string
			  },
	): ZonedDateTime {
		return ZonedDateTime.from(super.toZonedDateTime(timeZoneAndTime))
	}

	toPlainDateTime(
		temporalTime?: Temporal.PlainTime | Temporal.PlainTimeLike | string,
	): PlainDateTime {
		return PlainDateTime.from(super.toPlainDateTime(temporalTime))
	}

	withCalendar(calendar: Temporal.CalendarLike): PlainDate {
		return PlainDate.from(super.withCalendar(calendar))
	}

	since(
		other: Temporal.PlainDate | Temporal.PlainDateLike | string,
		options?: Temporal.DifferenceOptions<'year' | 'month' | 'week' | 'day'>,
	): Duration {
		return Duration.from(super.since(other, options))
	}

	until(
		other: Temporal.PlainDate | Temporal.PlainDateLike | string,
		options?: Temporal.DifferenceOptions<'year' | 'month' | 'week' | 'day'>,
	): Duration {
		return Duration.from(super.until(other, options))
	}
}
