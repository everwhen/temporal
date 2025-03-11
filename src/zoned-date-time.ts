import { Temporal } from 'temporal-polyfill'
import { toLocale } from './common.js'
import { Duration } from './duration.js'
import { PlainDateTime } from './plain-date-time.js'
import { PlainDate } from './plain-date.js'
import { PlainTime } from './plain-time.js'
import { PlainYearMonth } from './plain-year-month.js'
import { MethodParameters } from './type-utils.js'

export type ZonedDateTimeLike =
	| ZonedDateTime
	| Temporal.ZonedDateTime
	| Temporal.ZonedDateTimeLike

export class ZonedDateTime extends Temporal.ZonedDateTime {
	static now(tzLike?: Temporal.TimeZoneLike): ZonedDateTime {
		return ZonedDateTime.from(Temporal.Now.zonedDateTimeISO(tzLike))
	}

	static from(
		...args: Parameters<typeof Temporal.ZonedDateTime.from>
	): ZonedDateTime {
		const date = Temporal.ZonedDateTime.from(...args)
		return new ZonedDateTime(
			date.epochNanoseconds,
			date.timeZoneId,
			date.calendarId,
		)
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

	add(...args: MethodParameters<Temporal.ZonedDateTime, 'add'>): ZonedDateTime {
		return ZonedDateTime.from(super.add(...args))
	}

	subtract(
		...args: MethodParameters<Temporal.ZonedDateTime, 'subtract'>
	): ZonedDateTime {
		return ZonedDateTime.from(super.subtract(...args))
	}

	with(
		...args: MethodParameters<Temporal.ZonedDateTime, 'with'>
	): ZonedDateTime {
		return ZonedDateTime.from(super.with(...args))
	}

	withCalendar(calendar: Temporal.CalendarLike): ZonedDateTime {
		return ZonedDateTime.from(super.withCalendar(calendar))
	}

	withPlainTime(
		...args: MethodParameters<Temporal.ZonedDateTime, 'withPlainTime'>
	): ZonedDateTime {
		return ZonedDateTime.from(super.withPlainTime(...args))
	}

	withPlainDate(
		...args: MethodParameters<Temporal.ZonedDateTime, 'withPlainDate'>
	): ZonedDateTime {
		return ZonedDateTime.from(super.withPlainDate(...args))
	}

	withTimeZone(timeZone: Temporal.TimeZoneLike): ZonedDateTime {
		return ZonedDateTime.from(super.withTimeZone(timeZone))
	}

	round(
		...args: MethodParameters<Temporal.ZonedDateTime, 'round'>
	): ZonedDateTime {
		return ZonedDateTime.from(super.round(...args))
	}

	since(...args: MethodParameters<Temporal.ZonedDateTime, 'since'>): Duration {
		return Duration.from(super.since(...args))
	}

	until(...args: MethodParameters<Temporal.ZonedDateTime, 'until'>): Duration {
		return Duration.from(super.until(...args))
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
