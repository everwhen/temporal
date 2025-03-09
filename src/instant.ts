import { Temporal } from 'temporal-polyfill'
import { toLocale } from './common.js'
import { Duration } from './duration.js'
import { ZonedDateTime } from './zoned-date-time.js'

export type InstantLike = Instant | Temporal.Instant

export class Instant extends Temporal.Instant {
	static now(): Instant {
		return Instant.from(Temporal.Now.instant())
	}

	static from(item: Temporal.Instant | string): Instant {
		const instant = Temporal.Instant.from(item)
		return new Instant(instant.epochNanoseconds)
	}

	compare(other: InstantLike): Temporal.ComparisonResult {
		return Temporal.Instant.compare(this, other)
	}

	add(
		durationLike:
			| Omit<
					Temporal.Duration | Temporal.DurationLike,
					'years' | 'months' | 'weeks' | 'days'
			  >
			| string,
	): Instant {
		return Instant.from(super.add(durationLike))
	}

	subtract(
		durationLike:
			| Omit<
					Temporal.Duration | Temporal.DurationLike,
					'years' | 'months' | 'weeks' | 'days'
			  >
			| string,
	): Instant {
		return Instant.from(super.subtract(durationLike))
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
	): Instant {
		return Instant.from(super.round(roundTo))
	}

	since(
		other: InstantLike | string,
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

	until(
		other: InstantLike | string,
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

	toZonedDateTime(calendarAndTimeZone: {
		timeZone: Temporal.TimeZoneLike
		calendar: Temporal.CalendarLike
	}): ZonedDateTime {
		return ZonedDateTime.from(super.toZonedDateTime(calendarAndTimeZone))
	}

	toZonedDateTimeISO(tzLike: Temporal.TimeZoneLike): ZonedDateTime {
		return ZonedDateTime.from(super.toZonedDateTimeISO(tzLike))
	}

	isBefore(other: InstantLike): boolean {
		return this.compare(other) === -1
	}

	isAfter(other: InstantLike): boolean {
		return this.compare(other) === 1
	}

	unix(): number {
		return this.epochSeconds
	}

	toLocaleString(
		localesOrOptions?: string | string[] | Intl.DateTimeFormatOptions,
		formatOptions?: Intl.DateTimeFormatOptions,
	): string {
		const { locale, options } = toLocale(localesOrOptions, formatOptions)
		return super.toLocaleString(locale, options)
	}
}
