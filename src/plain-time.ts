import { Temporal } from 'temporal-polyfill'
import { toLocale } from './common.js'
import { Duration } from './duration.js'
import { PlainDateTime } from './plain-date-time.js'
import type { PlainDateLike } from './plain-date.js'
import { MethodParameters } from './type-utils.js'
import { ZonedDateTime } from './zoned-date-time.js'

export type PlainTimeLike =
	| PlainTime
	| Temporal.PlainTime
	| Temporal.PlainTimeLike

export class PlainTime extends Temporal.PlainTime {
	static now(): PlainTime {
		return PlainTime.from(Temporal.Now.plainTimeISO())
	}

	static from(...args: Parameters<typeof Temporal.PlainTime.from>): PlainTime {
		const time = Temporal.PlainTime.from(...args)
		return new PlainTime(
			time.hour,
			time.minute,
			time.second,
			time.millisecond,
			time.microsecond,
			time.nanosecond,
		)
	}

	compare(other: PlainTimeLike | string): Temporal.ComparisonResult {
		return PlainTime.compare(this, other)
	}

	/**
	 * Check if this time is before another time.
	 * @param other The other PlainTime instance to compare.
	 */
	isBefore(other: PlainTime): boolean {
		return PlainTime.compare(this, other) === -1
	}

	/**
	 * Check if this time is after another time.
	 * @param other The other PlainTime instance to compare.
	 */
	isAfter(other: PlainTime): boolean {
		return PlainTime.compare(this, other) === 1
	}

	add(...args: MethodParameters<Temporal.PlainTime, 'add'>): PlainTime {
		return PlainTime.from(super.add(...args))
	}

	subtract(
		...args: MethodParameters<Temporal.PlainTime, 'subtract'>
	): PlainTime {
		return PlainTime.from(super.subtract(...args))
	}

	round(...args: MethodParameters<Temporal.PlainTime, 'round'>): PlainTime {
		return PlainTime.from(super.round(...args))
	}

	toZonedDateTime(
		...args: MethodParameters<Temporal.PlainTime, 'toZonedDateTime'>
	): ZonedDateTime {
		return ZonedDateTime.from(...args)
	}

	until(...args: MethodParameters<Temporal.PlainTime, 'until'>): Duration {
		return Duration.from(super.until(...args))
	}

	since(...args: MethodParameters<Temporal.PlainTime, 'since'>): Duration {
		return Duration.from(super.since(...args))
	}

	toPlainDateTime(temporalDate: PlainDateLike | string): PlainDateTime {
		return PlainDateTime.from(super.toPlainDateTime(temporalDate))
	}

	with(...args: MethodParameters<Temporal.PlainTime, 'with'>): PlainTime {
		return PlainTime.from(...args)
	}

	toLocaleString(
		localesOrOptions?: string | string[] | Intl.DateTimeFormatOptions,
		formatOptions?: Intl.DateTimeFormatOptions,
	): string {
		const { locale, options } = toLocale(localesOrOptions, formatOptions)
		return super.toLocaleString(locale, options)
	}
}
