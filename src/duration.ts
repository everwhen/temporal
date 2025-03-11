import { Temporal } from 'temporal-polyfill'
import type { PlainDateTimeLike } from './plain-date-time.js'
import type { PlainDateLike } from './plain-date.js'
import type { ZonedDateTimeLike } from './zoned-date-time.js'

export type DurationLike = Duration | Temporal.Duration | Temporal.DurationLike

export type DurationSumOptions = {
	relativeTo?: ZonedDateTimeLike | PlainDateTimeLike | PlainDateLike | string
	roundOf?: Temporal.DurationRoundTo
}

export class Duration extends Temporal.Duration {
	static from(...args: Parameters<typeof Temporal.Duration.from>): Duration {
		const d = Temporal.Duration.from(...args)
		return new Duration(
			d.years,
			d.months,
			d.weeks,
			d.days,
			d.hours,
			d.minutes,
			d.seconds,
			d.milliseconds,
			d.microseconds,
			d.nanoseconds,
		)
	}

	compare(
		other: DurationLike,
		options?: Temporal.DurationArithmeticOptions,
	): Temporal.ComparisonResult {
		return Temporal.Duration.compare(this, other, options)
	}

	get isNegated(): boolean {
		return this.sign === -1
	}

	sum(
		unit: Temporal.TotalUnit<Temporal.DateTimeUnit>,
		opts?: DurationSumOptions,
	) {
		let duration = Duration.from(this)
		if (opts?.roundOf) {
			duration = this.round(opts.roundOf)
		}

		return duration.total({ unit, relativeTo: opts?.relativeTo })
	}

	round(roundTo: Temporal.DurationRoundTo): Duration {
		return Duration.from(super.round(roundTo))
	}

	add(
		other: DurationLike | string,
		options?: Temporal.DurationArithmeticOptions,
	): Duration {
		return Duration.from(super.add(other, options))
	}

	subtract(
		other: DurationLike | string,
		options?: Temporal.DurationArithmeticOptions,
	): Duration {
		return Duration.from(super.subtract(other, options))
	}

	negated(): Duration {
		return Duration.from(super.negated())
	}

	with(durationLike: Temporal.DurationLike): Duration {
		return Duration.from(super.with(durationLike))
	}

	abs(): Duration {
		return Duration.from(super.abs())
	}
}
