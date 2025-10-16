import { Temporal } from 'temporal-polyfill'
import { Duration } from './duration.ts'
import { max, min } from './fn/index.ts'
import type { MethodParameters } from './type-utils.ts'

export type PlainTimeLike = Temporal.PlainTimeLike

export class PlainTime extends Temporal.PlainTime {
  static now(): PlainTime {
    return PlainTime.from(Temporal.Now.plainTimeISO())
  }

  static override from(
    ...args: Parameters<typeof Temporal.PlainTime.from>
  ): PlainTime {
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

  static max(...dates: PlainTime[]): PlainTime {
    return max(...dates)
  }

  static min(...dates: PlainTime[]): PlainTime {
    return min(...dates)
  }

  compare(other: PlainTimeLike | string): Temporal.ComparisonResult {
    return PlainTime.compare(this, other)
  }

  isBefore(other: PlainTimeLike): boolean {
    return PlainTime.compare(this, other) === -1
  }

  isAfter(other: PlainTimeLike): boolean {
    return PlainTime.compare(this, other) === 1
  }

  override add(
    ...args: MethodParameters<Temporal.PlainTime, 'add'>
  ): PlainTime {
    return PlainTime.from(super.add(...args))
  }

  override subtract(
    ...args: MethodParameters<Temporal.PlainTime, 'subtract'>
  ): PlainTime {
    return PlainTime.from(super.subtract(...args))
  }

  override round(
    ...args: MethodParameters<Temporal.PlainTime, 'round'>
  ): PlainTime {
    return PlainTime.from(super.round(...args))
  }

  override until(
    ...args: MethodParameters<Temporal.PlainTime, 'until'>
  ): Duration {
    return Duration.from(super.until(...args))
  }

  override since(
    ...args: MethodParameters<Temporal.PlainTime, 'since'>
  ): Duration {
    return Duration.from(super.since(...args))
  }

  override with(
    ...args: MethodParameters<Temporal.PlainTime, 'with'>
  ): PlainTime {
    return PlainTime.from(super.with(...args))
  }
}
