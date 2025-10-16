import { Temporal } from 'temporal-polyfill'
import { Duration } from './duration.ts'
import type { MethodParameters } from './type-utils.ts'
import { ZonedDateTime } from './zoned-date-time.ts'

export type InstantLike = Instant | Temporal.Instant

export class Instant extends Temporal.Instant {
  static now(): Instant {
    return Instant.from(Temporal.Now.instant())
  }

  static override from(
    ...args: Parameters<typeof Temporal.Instant.from>
  ): Instant {
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

  override add(...args: MethodParameters<Temporal.Instant, 'add'>): Instant {
    return Instant.from(super.add(...args))
  }

  override subtract(
    ...args: MethodParameters<Temporal.Instant, 'subtract'>
  ): Instant {
    return Instant.from(super.subtract(...args))
  }

  override round(
    ...args: MethodParameters<Temporal.Instant, 'round'>
  ): Instant {
    return Instant.from(super.round(...args))
  }

  override since(
    ...args: MethodParameters<Temporal.Instant, 'since'>
  ): Duration {
    return Duration.from(super.since(...args))
  }

  override until(
    ...args: MethodParameters<Temporal.Instant, 'until'>
  ): Duration {
    return Duration.from(super.until(...args))
  }

  override toZonedDateTimeISO(tzLike: Temporal.TimeZoneLike): ZonedDateTime {
    return ZonedDateTime.from(super.toZonedDateTimeISO(tzLike))
  }
}
