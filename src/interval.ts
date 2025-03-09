import { Duration } from './duration.js'
import { isPlainYearMonth, isPoint } from './is.js'
import { PlainDate } from './plain-date.js'
import { PlainYearMonth } from './plain-year-month.js'
import { ComparablePoints, type Point } from './point.js'

export type ComparableInterval<T extends Point, U extends Point> =
	ComparablePoints<T, U> extends true ? U : never

export type IntervalLike<T extends Point = Point> =
	| {
			start: T
			end: T
	  }
	| Interval<T>

export class Interval<T extends Point = Point> {
	public readonly start: T
	public readonly end: T

	constructor(start: T, end: T) {
		this.start = start
		this.end = end
		this.validate()
	}

	static from<T extends Point = Point>(
		intervalLike: IntervalLike<T>,
	): Interval<T>
	static from(yearMonth: PlainYearMonth): Interval<PlainDate>
	static from<T extends Point = Point>(
		value: IntervalLike<T> | PlainYearMonth,
	): Interval<T> {
		if (isPlainYearMonth(value)) {
			return new Interval(
				value.startOfMonth(),
				value.endOfMonth(),
			) as Interval<T>
		}

		return new Interval<T>(value.start, value.end)
	}

	static overlaps<T extends Point>(
		a: IntervalLike<T>,
		b: IntervalLike<T>,
	): boolean {
		return a.start.compare(b.end) <= 0 && a.end.compare(b.start) >= 0
	}

	validate(): void {
		if (this.start.compare(this.end) > 0) {
			throw new Error('Invalid interval: end cannot be before start')
		}
	}

	isBefore(other: IntervalLike<T>): boolean
	isBefore<U extends Point>(
		other: IntervalLike<ComparableInterval<T, U>>,
	): boolean
	isBefore<U extends Point>(
		other: IntervalLike<T> | IntervalLike<ComparableInterval<T, U>>,
	): boolean {
		return this.end.compare(other.start) < 0
	}

	isAfter(other: IntervalLike<T>): boolean
	isAfter<U extends Point>(
		other: IntervalLike<ComparableInterval<T, U>>,
	): boolean
	isAfter<U extends Point>(
		other: IntervalLike<T> | IntervalLike<ComparableInterval<T, U>>,
	): boolean {
		return this.start.compare(other.end) > 0
	}

	equals(other: IntervalLike<T>): boolean
	equals<U extends Point>(
		other: IntervalLike<ComparableInterval<T, U>>,
	): boolean
	equals<U extends Point>(
		other: IntervalLike<T> | IntervalLike<ComparableInterval<T, U>>,
	): boolean {
		return this.start.equals(other.start) && this.end.equals(other.end)
	}

	overlaps(other: IntervalLike<T>): boolean
	overlaps<U extends Point>(
		other: IntervalLike<ComparableInterval<T, U>>,
	): boolean
	overlaps<U extends Point>(
		other: IntervalLike<T> | IntervalLike<ComparableInterval<T, U>>,
	): boolean {
		return (
			this.start.compare(other.end) <= 0 && this.end.compare(other.start) >= 0
		)
	}

	contains(value: T | IntervalLike<T>): boolean
	contains<U extends Point>(
		value: ComparableInterval<T, U> | IntervalLike<ComparableInterval<T, U>>,
	): boolean
	contains<U extends Point>(
		value:
			| T
			| IntervalLike<T>
			| ComparableInterval<T, U>
			| IntervalLike<ComparableInterval<T, U>>,
	): boolean {
		if (isPoint(value)) {
			return this.start.compare(value) <= 0 && this.end.compare(value) >= 0
		}

		return (
			this.start.compare(value.start) <= 0 &&
			this.end.compare(value.start) >= 0 &&
			this.start.compare(value.end) <= 0 &&
			this.end.compare(value.end) >= 0
		)
	}

	toJSON(): {
		start: string
		end: string
	} {
		return {
			start: this.start.toString(),
			end: this.end.toString(),
		}
	}

	toString(): string {
		return `[${this.start.toString()}, ${this.end.toString()}]`
	}

	toLocaleString(
		localesOrOptions?: string | string[] | Intl.DateTimeFormatOptions,
		formatOptions?: Intl.DateTimeFormatOptions,
	): string {
		return `[${this.start.toLocaleString(
			localesOrOptions,
			formatOptions,
		)}, ${this.end.toLocaleString(localesOrOptions, formatOptions)}]`
	}

	get duration(): Duration {
		return this.start.until(this.end)
	}
}
