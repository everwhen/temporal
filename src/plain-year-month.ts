import { Temporal } from 'temporal-polyfill'
import { toLocale } from './common.js'
import { Duration } from './duration.js'
import { PlainDate } from './plain-date.js'
import { MethodParameters } from './type-utils.js'

export type PlainYearMonthLike =
	| PlainYearMonth
	| Temporal.PlainYearMonth
	| Temporal.PlainYearMonthLike

export class PlainYearMonth extends Temporal.PlainYearMonth {
	static now(): PlainYearMonth {
		return PlainYearMonth.from(PlainDate.now())
	}

	static from(
		...args: Parameters<typeof Temporal.PlainYearMonth.from>
	): PlainYearMonth {
		const month = Temporal.PlainYearMonth.from(...args).getISOFields()
		return new PlainYearMonth(
			month.isoYear,
			month.isoMonth,
			month.calendar,
			month.isoDay,
		)
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

	add(
		...args: MethodParameters<Temporal.PlainYearMonth, 'add'>
	): PlainYearMonth {
		return PlainYearMonth.from(super.add(...args))
	}

	subtract(
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

	toPlainDate(day?: { day: number }): PlainDate {
		const opts = day ? day : { day: 1 }
		return PlainDate.from(super.toPlainDate(opts))
	}

	toLocaleString(
		localesOrOptions?: string | string[] | Intl.DateTimeFormatOptions,
		formatOptions?: Intl.DateTimeFormatOptions,
	): string {
		const opts = formatOptions
			? formatOptions.calendar
				? formatOptions
				: { ...formatOptions, calendar: this.calendarId }
			: { calendar: this.calendarId }

		const { locale, options } = toLocale(localesOrOptions, opts)
		return super.toLocaleString(locale, options)
	}

	with(...args: MethodParameters<Temporal.PlainYearMonth, 'with'>) {
		return PlainYearMonth.from(super.with(...args))
	}

	until(...args: MethodParameters<Temporal.PlainYearMonth, 'until'>): Duration {
		return Duration.from(super.until(...args))
	}

	since(...args: MethodParameters<Temporal.PlainYearMonth, 'since'>): Duration {
		return Duration.from(super.since(...args))
	}
}
