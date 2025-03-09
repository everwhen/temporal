import { Temporal } from 'temporal-polyfill'
import { toLocale } from './common.js'
import { Duration, type DurationLike } from './duration.js'
import { PlainDate } from './plain-date.js'

export type PlainYearMonthLike =
	| PlainYearMonth
	| Temporal.PlainYearMonth
	| Temporal.PlainYearMonthLike

export class PlainYearMonth extends Temporal.PlainYearMonth {
	static from(
		item: Temporal.PlainYearMonth | Temporal.PlainYearMonthLike | string,
		options?: Temporal.AssignmentOptions,
	): PlainYearMonth {
		const month = Temporal.PlainYearMonth.from(item, options).getISOFields()
		return new PlainYearMonth(
			month.isoYear,
			month.isoMonth,
			month.calendar,
			month.isoDay,
		)
	}

	static now(): PlainYearMonth {
		return PlainYearMonth.from(PlainDate.now())
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
		durationLike: DurationLike | string,
		options?: Temporal.ArithmeticOptions,
	): PlainYearMonth {
		return PlainYearMonth.from(super.add(durationLike, options))
	}

	subtract(
		durationLike: DurationLike | string,
		options?: Temporal.ArithmeticOptions,
	): PlainYearMonth {
		return PlainYearMonth.from(super.subtract(durationLike, options))
	}

	contains(date: PlainYearMonthLike | Temporal.PlainDateLike): boolean {
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

	with(
		yearMonthLike: Temporal.PlainYearMonthLike,
		options?: Temporal.AssignmentOptions,
	) {
		return PlainYearMonth.from(super.with(yearMonthLike, options))
	}

	until(
		other: PlainYearMonthLike | string,
		options?: Temporal.DifferenceOptions<'year' | 'month'>,
	): Duration {
		return Duration.from(super.until(other, options))
	}

	since(
		other: PlainYearMonthLike | string,
		options?: Temporal.DifferenceOptions<'year' | 'month'>,
	): Duration {
		return Duration.from(super.since(other, options))
	}
}
