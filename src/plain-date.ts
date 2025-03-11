import { Temporal } from 'temporal-polyfill'
import { toLocale } from './common.js'
import { Duration } from './duration.js'
import { PlainDateTime } from './plain-date-time.js'
import { PlainYearMonth } from './plain-year-month.js'
import { MethodParameters } from './type-utils.js'
import { ZonedDateTime } from './zoned-date-time.js'

export type PlainDateLike =
	| PlainDate
	| Temporal.PlainDate
	| Temporal.PlainDateLike

export class PlainDate extends Temporal.PlainDate {
	static now(tzLike?: Temporal.TimeZoneLike): PlainDate {
		return PlainDate.from(Temporal.Now.plainDateISO(tzLike))
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

	with(...args: MethodParameters<Temporal.PlainDate, 'with'>): PlainDate {
		return PlainDate.from(super.with(...args))
	}

	add(...args: MethodParameters<Temporal.PlainDate, 'add'>): PlainDate {
		return PlainDate.from(super.add(...args))
	}

	subtract(
		...args: MethodParameters<Temporal.PlainDate, 'subtract'>
	): PlainDate {
		return PlainDate.from(super.subtract(...args))
	}

	isToday(): boolean {
		return PlainDate.now().equals(this)
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

	toZonedDateTime(
		...args: MethodParameters<Temporal.PlainDate, 'toZonedDateTime'>
	): ZonedDateTime {
		return ZonedDateTime.from(super.toZonedDateTime(...args))
	}

	toPlainDateTime(
		...args: MethodParameters<Temporal.PlainDate, 'toPlainDateTime'>
	): PlainDateTime {
		return PlainDateTime.from(super.toPlainDateTime(...args))
	}

	withCalendar(calendar: Temporal.CalendarLike): PlainDate {
		return PlainDate.from(super.withCalendar(calendar))
	}

	since(...args: MethodParameters<Temporal.PlainDate, 'since'>): Duration {
		return Duration.from(super.since(...args))
	}

	until(...args: MethodParameters<Temporal.PlainDate, 'until'>): Duration {
		return Duration.from(super.until(...args))
	}
}
