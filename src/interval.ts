import { Duration } from './duration.ts'
import { parse, stringify } from './fn/json.ts'
import { assertIntervalLike, isIntervalLike, isPoint } from './is.ts'
import { type Point } from './point.ts'

export interface OverlapsOptions {
  inclusive?: boolean
}

export type IntervalLike<T extends Point = Point> = {
  start: T
  end: T
}

export class Interval<T extends Point = Point> {
  public readonly start: T
  public readonly end: T

  constructor(start: T, end: T) {
    this.start = start
    this.end = end
    this.validate()
  }

  static from<T extends Point = Point>(
    value: string | T | IntervalLike<T>,
  ): Interval<T> {
    let intervalLike: IntervalLike<T>
    if (typeof value === 'string') {
      const parsed = parse(value)
      assertIntervalLike(parsed)
      intervalLike = parsed as IntervalLike<T>
    } else {
      intervalLike = {
        start: isPoint(value) ? value : value.start,
        end: isPoint(value) ? value : value.end,
      }
    }

    return new Interval<T>(intervalLike.start, intervalLike.end)
  }

  static compare<T extends Point>(
    a: IntervalLike<T>,
    b: IntervalLike<T>,
  ): number {
    const startComparison = a.start.compare(b.start)
    if (startComparison !== 0) {
      return startComparison
    }

    return a.end.compare(b.end)
  }

  static overlaps<T extends Point>(
    a: IntervalLike<T>,
    b: IntervalLike<T>,
    options?: OverlapsOptions,
  ): boolean {
    if (options?.inclusive) {
      return a.start.compare(b.end) <= 0 && a.end.compare(b.start) >= 0
    }
    return a.start.compare(b.end) < 0 && a.end.compare(b.start) > 0
  }

  validate(): void {
    if (this.start.compare(this.end) > 0) {
      throw new Error(
        `Invalid interval: end (${this.end.toString()}) cannot be before start (${this.start.toString()})`,
      )
    }
  }

  isBefore(other: IntervalLike<T> | T): boolean {
    const otherPoint = isIntervalLike(other) ? other.start : other
    return this.end.compare(otherPoint) < 0
  }

  isAfter(other: IntervalLike<T> | T): boolean {
    const otherPoint = isIntervalLike(other) ? other.end : other
    return this.start.compare(otherPoint) > 0
  }

  equals(other: IntervalLike<T>): boolean {
    return this.start.equals(other.start) && this.end.equals(other.end)
  }

  overlaps(other: IntervalLike<T>, options?: OverlapsOptions): boolean {
    if (options?.inclusive) {
      return (
        this.start.compare(other.end) <= 0 && this.end.compare(other.start) >= 0
      )
    }

    return (
      this.start.compare(other.end) < 0 && this.end.compare(other.start) > 0
    )
  }

  contains(value: T | IntervalLike<T>): boolean {
    if (isPoint(value)) {
      return this.start.compare(value) <= 0 && this.end.compare(value) >= 0
    }

    return (
      this.start.compare(value.start) <= 0 && this.end.compare(value.end) >= 0
    )
  }

  toJSON(): string {
    return stringify({
      start: this.start,
      end: this.end,
    })
  }

  toString(): string {
    return `[${this.start.toString()}, ${this.end.toString()}]`
  }

  get duration(): Duration {
    return this.start.until(this.end)
  }
}
