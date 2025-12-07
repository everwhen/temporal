import {
  Duration,
  type DateDurationLike,
  type DurationLike,
  type TimeDurationLike,
  type YearMonthDurationLike,
} from './duration.ts'
import { invariant } from './fn/misc.ts'
import { isPlainTime, isPlainYearMonth } from './is.ts'
import type { PlainDateTime } from './plain-date-time.ts'
import type { PlainDate } from './plain-date.ts'
import type { PlainTime } from './plain-time.ts'
import type { PlainYearMonth } from './plain-year-month.ts'
import type { Point } from './point.ts'
import type { ZonedDateTime } from './zoned-date-time.ts'

export type SequenceStep<T extends Point> = T extends PlainTime
  ? TimeDurationLike
  : T extends PlainYearMonth
    ? YearMonthDurationLike
    : T extends PlainDate
      ? DateDurationLike
      : T extends PlainDateTime | ZonedDateTime
        ? DurationLike
        : never

export interface SequenceBounds<T extends Point> {
  start: T
  end: T
}

export interface SequenceDef<T extends Point> extends SequenceBounds<T> {
  step?: SequenceStep<T>
}

export interface SequenceItem<T extends Point> {
  previous?: T
  value: T
  next?: T
}

export class Sequence<T extends Point> implements Iterable<T> {
  readonly start: T
  readonly end: T
  readonly step: SequenceStep<T>
  #duration: Duration

  constructor(start: T, end: T, step: SequenceStep<T>) {
    // Excluding PlainTime as time is circular, it is simultaneously before and after midnight.
    if (!isPlainTime(start)) {
      invariant(
        start.compare(end) <= 0,
        `Invalid bounds. start: ${start.toString()} - end: ${end.toString()} `,
      )
    }

    this.start = start
    this.end = end
    this.step = step
    this.#duration = this.start.until(this.end)
  }

  static from<T extends Point>(bounds: SequenceDef<T>): Sequence<T> {
    let stepDefault: SequenceStep<T>
    if (isPlainTime(bounds.start)) {
      stepDefault = { hours: 1 } as SequenceStep<T>
    } else if (isPlainYearMonth(bounds.start)) {
      stepDefault = { months: 1 } as SequenceStep<T>
    } else {
      stepDefault = { days: 1 } as SequenceStep<T>
    }
    return new Sequence(bounds.start, bounds.end, bounds.step ?? stepDefault)
  }

  *[Symbol.iterator](): Iterator<T> {
    let current = this.start
    // Special handling for PlainTime as time is circular, incrementing `current` will eventually circle back to 00:00, causing a infinite loop
    let timeAccumulated = Duration.from({ seconds: 0 })

    yield current

    while (current.compare(this.end) < 0) {
      if (isPlainTime(this.start)) {
        timeAccumulated = timeAccumulated.add(this.step)

        if (timeAccumulated.compare(this.#duration) > 0) {
          break
        }
      }

      current = current.add(this.step) as T

      yield current
    }
  }

  get bounds(): SequenceBounds<T> {
    return { start: this.start, end: this.end }
  }

  *items(): Generator<SequenceItem<T>> {
    let timeAccumulated = Duration.from({ seconds: 0 })
    const item: SequenceItem<T> = {
      value: this.start,
      next: this.start.add(this.step) as T,
    }

    yield item

    while (item.value.compare(this.end) < 0) {
      if (isPlainTime(this.start)) {
        timeAccumulated = timeAccumulated.add(this.step)
        if (timeAccumulated.compare(this.#duration) > 0) {
          break
        }
      }

      item.previous = item.value
      item.value = item.value.add(this.step) as T
      const next = item.value.add(this.step)

      if (next.compare(this.end) <= 0) {
        item.next = next as T
      } else {
        delete item.next
      }

      yield item
    }
  }

  forEach(callbackfn: (value: T, index: number) => void): void {
    let index = 0

    for (const val of this) {
      callbackfn(val, index)
      index += 1
    }
  }

  map<U>(mapper: (temporal: T) => U): U[] {
    const items: U[] = []

    for (const tem of this) {
      items.push(mapper(tem))
    }

    return items
  }

  group<K>(keyFn: (item: T) => K): Map<K, T[]> {
    const groups = new Map<K, T[]>()

    for (const item of this) {
      const key = keyFn(item)
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key)!.push(item)
    }

    return groups
  }

  select<U>(predicate: (item: T) => boolean, mapper: (temporal: T) => U): U[] {
    const values: U[] = []
    for (const item of this) {
      if (predicate(item)) {
        values.push(mapper(item))
      }
    }
    return values
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.select(predicate, (t) => t)
  }

  with(
    bounds: Partial<SequenceBounds<T>> & { step?: SequenceStep<T> },
  ): Sequence<T> {
    return new Sequence(
      bounds.start ?? this.start,
      bounds.end ?? this.end,
      bounds.step ?? this.step,
    )
  }

  get length(): number {
    return Array.from(this).length
  }

  contains(target: T): boolean {
    return this.start.compare(target) <= 0 && this.end.compare(target) >= 0
  }

  toMap<U>(mapper: (item: T) => U): Map<string, U> {
    const result = new Map<string, U>()

    for (const item of this) {
      const key = item.toString()
      const value = mapper(item)
      result.set(key, value)
    }

    return result
  }

  toJSON() {
    return {
      start: this.start.toString(),
      end: this.end.toString(),
      step: Duration.from(this.step).toString(),
    }
  }

  indexOf(target: T): number {
    if (!this.contains(target)) {
      return -1
    }
    let index = 0

    for (const point of this) {
      if (point.equals(target)) {
        return index
      }
      index++
    }

    return index
  }

  toString() {
    return `[${this.start.toString()}, ${this.end.toString()}, ${Duration.from(this.step).toString()}]`
  }
}
