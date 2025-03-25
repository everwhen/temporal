import { Temporal } from 'temporal-polyfill'
import { Duration } from './duration.js'
import { PlainDate } from './plain-date.js'
import { PlainTime, type PlainTimeLike } from './plain-time.js'
import { PlainYearMonth } from './plain-year-month.js'
import { MethodParameters } from './type-utils.js'
import { ZonedDateTime } from './zoned-date-time.js'

export type PlainDateTimeLike =
	| PlainDateTime
	| Temporal.PlainDateTime
	| Temporal.PlainDateTimeLike

export class PlainDateTime extends Temporal.PlainDateTime {
	static now(tzLike?: Temporal.TimeZoneLike): PlainDateTime {
		return PlainDateTime.from(Temporal.Now.plainDateTimeISO(tzLike))
	}

	static from(
		...args: Parameters<typeof Temporal.PlainDateTime.from>
	): PlainDateTime {
		const date = Temporal.PlainDateTime.from(...args)
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
		...args: MethodParameters<Temporal.PlainDateTime, 'subtract'>
	): PlainDateTime {
		return PlainDateTime.from(super.subtract(...args))
	}

	add(...args: MethodParameters<Temporal.PlainDateTime, 'add'>): PlainDateTime {
		return PlainDateTime.from(super.add(...args))
	}

	since(...args: MethodParameters<Temporal.PlainDateTime, 'since'>): Duration {
		return Duration.from(super.since(...args))
	}

	until(...args: MethodParameters<Temporal.PlainDateTime, 'until'>): Duration {
		return Duration.from(super.until(...args))
	}

	round(
		...args: MethodParameters<Temporal.PlainDateTime, 'round'>
	): PlainDateTime {
		return PlainDateTime.from(super.round(...args))
	}

	toPlainDate(): PlainDate {
		return PlainDate.from(this)
	}

	toPlainTime(): PlainTime {
		return PlainTime.from(this)
	}

	toZonedDateTime(
		...args: MethodParameters<Temporal.PlainDateTime, 'toZonedDateTime'>
	): ZonedDateTime {
		return ZonedDateTime.from(super.toZonedDateTime(...args))
	}

	toPlainYearMonth(): PlainYearMonth {
		return PlainYearMonth.from(this)
	}

	withPlainTime(timeLike?: PlainTimeLike | string): PlainDateTime {
		return PlainDateTime.from(super.withPlainTime(timeLike))
	}

	withCalendar(calendar: Temporal.CalendarLike): PlainDateTime {
		return PlainDateTime.from(super.withCalendar(calendar))
	}

	with(
		...args: MethodParameters<Temporal.PlainDateTime, 'with'>
	): PlainDateTime {
		return PlainDateTime.from(super.with(...args))
	}
}
