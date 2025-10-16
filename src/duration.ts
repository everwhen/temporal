import { Temporal } from 'temporal-polyfill'
import type { PlainDateTimeLike } from './plain-date-time.ts'
import type { PlainDateLike } from './plain-date.ts'
import type { ZonedDateTimeLike } from './zoned-date-time.ts'

export type DurationLike = Temporal.DurationLike

export type TimeDurationLike = Pick<
  DurationLike,
  Temporal.PluralUnit<Temporal.TimeUnit>
>

export type DateDurationLike = Pick<
  DurationLike,
  Temporal.PluralUnit<Temporal.DateUnit>
>

export type YearMonthDurationLike = Pick<DurationLike, 'years' | 'months'>

export type DurationSumOptions = {
  relativeTo?: ZonedDateTimeLike | PlainDateTimeLike | PlainDateLike | string
  roundOf?: Temporal.DurationRoundTo
}

export class Duration extends Temporal.Duration {
  static override from(
    ...args: Parameters<typeof Temporal.Duration.from>
  ): Duration {
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
    const args: Temporal.DurationTotalOf = { unit }
    if (opts?.relativeTo) {
      args.relativeTo = opts?.relativeTo
    }
    return duration.total(args)
  }

  override round(roundTo: Temporal.DurationRoundTo): Duration {
    return Duration.from(super.round(roundTo))
  }

  override add(other: DurationLike | string): Duration {
    return Duration.from(super.add(other))
  }

  override subtract(other: DurationLike | string): Duration {
    return Duration.from(super.subtract(other))
  }

  override negated(): Duration {
    return Duration.from(super.negated())
  }

  override with(durationLike: Temporal.DurationLike): Duration {
    return Duration.from(super.with(durationLike))
  }

  override abs(): Duration {
    return Duration.from(super.abs())
  }
}
