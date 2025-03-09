import { Temporal } from 'temporal-polyfill'
import { toLocale } from './common.js'
import { Duration, type DurationLike } from './duration.js'
import { PlainDateTime } from './plain-date-time.js'
import type { PlainDateLike } from './plain-date.js'
import { ZonedDateTime } from './zoned-date-time.js'

export type PlainTimeLike =
	| PlainTime
	| Temporal.PlainTime
	| Temporal.PlainTimeLike

export class PlainTime extends Temporal.PlainTime {
	static now() {
		return PlainTime.from(Temporal.Now.plainTimeISO())
	}

	static from(
		item: Temporal.PlainTime | Temporal.PlainTimeLike | string,
		options?: Temporal.AssignmentOptions,
	) {
		const time = Temporal.PlainTime.from(item, options)
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

	with(
		timeLike: PlainTimeLike,
		options?: Temporal.AssignmentOptions,
	): PlainTime {
		return PlainTime.from(timeLike, options)
	}

	add(
		durationLike: DurationLike | string,
		options?: Temporal.ArithmeticOptions,
	): PlainTime {
		return PlainTime.from(super.add(durationLike, options))
	}

	subtract(
		durationLike: DurationLike | string,
		options?: Temporal.ArithmeticOptions,
	): PlainTime {
		return PlainTime.from(super.subtract(durationLike, options))
	}

	round(
		roundTo: Temporal.RoundTo<
			| 'hour'
			| 'minute'
			| 'second'
			| 'millisecond'
			| 'microsecond'
			| 'nanosecond'
		>,
	): PlainTime {
		return PlainTime.from(super.round(roundTo))
	}

	toZonedDateTime(timeZoneAndDate: {
		timeZone: Temporal.TimeZoneLike
		plainDate: PlainDateLike | string
	}): ZonedDateTime {
		return ZonedDateTime.from(timeZoneAndDate)
	}

	until(
		other: PlainTimeLike | string,
		options?: Temporal.DifferenceOptions<
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

	since(
		other: PlainTimeLike | string,
		options?: Temporal.DifferenceOptions<
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

	toPlainDateTime(temporalDate: PlainDateLike | string): PlainDateTime {
		return PlainDateTime.from(super.toPlainDateTime(temporalDate))
	}

	toLocaleString(
		localesOrOptions?: string | string[] | Intl.DateTimeFormatOptions,
		formatOptions?: Intl.DateTimeFormatOptions,
	): string {
		const { locale, options } = toLocale(localesOrOptions, formatOptions)
		return super.toLocaleString(locale, options)
	}
}
