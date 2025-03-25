import { Temporal } from 'temporal-polyfill'
import { Duration } from './duration.js'
import { MethodParameters } from './type-utils.js'
import { ZonedDateTime } from './zoned-date-time.js'

export type InstantLike = Instant | Temporal.Instant

export class Instant extends Temporal.Instant {
	static now(): Instant {
		return Instant.from(Temporal.Now.instant())
	}

	static from(...args: Parameters<typeof Temporal.Instant.from>): Instant {
		const instant = Temporal.Instant.from(...args)
		return new Instant(instant.epochNanoseconds)
	}

	compare(other: InstantLike): Temporal.ComparisonResult {
		return Temporal.Instant.compare(this, other)
	}

	isBefore(other: InstantLike): boolean {
		return this.compare(other) === -1
	}

	isAfter(other: InstantLike): boolean {
		return this.compare(other) === 1
	}

	add(...args: MethodParameters<Temporal.Instant, 'add'>): Instant {
		return Instant.from(super.add(...args))
	}

	subtract(...args: MethodParameters<Temporal.Instant, 'subtract'>): Instant {
		return Instant.from(super.subtract(...args))
	}

	round(...args: MethodParameters<Temporal.Instant, 'round'>): Instant {
		return Instant.from(super.round(...args))
	}

	since(...args: MethodParameters<Temporal.Instant, 'since'>): Duration {
		return Duration.from(super.since(...args))
	}

	until(...args: MethodParameters<Temporal.Instant, 'until'>): Duration {
		return Duration.from(super.until(...args))
	}

	toZonedDateTimeISO(tzLike: Temporal.TimeZoneLike): ZonedDateTime {
		return ZonedDateTime.from(super.toZonedDateTimeISO(tzLike))
	}
}
