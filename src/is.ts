import invariant from 'tiny-invariant'
import { Instant } from './instant.js'
import { Interval, IntervalLike } from './interval.js'
import { PlainDateTime } from './plain-date-time.js'
import { PlainDate } from './plain-date.js'
import { PlainTime } from './plain-time.js'
import { PlainYearMonth } from './plain-year-month.js'
import { Point } from './point.js'
import { ZonedDateTime } from './zoned-date-time.js'

export type TypeGuard<T> = (value: unknown) => value is T
/** Helper to extract the type from a type guard */
export type TypeGuardType<T> = T extends (value: unknown) => value is infer U
	? U
	: never

function tryIt<Result, Fallback = undefined>(
	fn: () => Result,
	fallback?: Fallback,
): Result | Fallback {
	try {
		return fn()
	} catch (error) {
		return fallback as Fallback
	}
}

export const isString = (value: unknown): value is string =>
	typeof value === 'string'
export const isObject = (value: unknown): value is object =>
	typeof value === 'object'

export function isInstant(value: unknown): value is Instant {
	return isString(value)
		? tryIt(() => !!Instant.from(value), false)
		: isObject(value) && value instanceof Instant
}

export function isPlainDate(value: unknown): value is PlainDate {
	return isString(value)
		? tryIt(() => !!PlainDate.from(value), false)
		: isObject(value) && value instanceof PlainDate
}

export function isPlainDateTime(value: unknown): value is PlainDateTime {
	return isString(value)
		? tryIt(() => !!PlainDateTime.from(value), false)
		: isObject(value) && value instanceof PlainDateTime
}

export function isPlainTime(value: unknown): value is PlainTime {
	return isString(value)
		? tryIt(() => !!PlainTime.from(value), false)
		: isObject(value) && value instanceof PlainTime
}

export function isPlainYearMonth(value: unknown): value is PlainYearMonth {
	return isString(value)
		? tryIt(() => !!PlainYearMonth.from(value), false)
		: isObject(value) && value instanceof PlainYearMonth
}

export function isZonedDateTime(value: unknown): value is ZonedDateTime {
	return isString(value)
		? tryIt(() => !!ZonedDateTime.from(value), false)
		: isObject(value) && value instanceof ZonedDateTime
}

export function isPoint<T extends Point>(
	value: unknown,
	typeGuard?: TypeGuard<T>,
): value is T {
	const result =
		isPlainTime(value) ||
		isPlainDateTime(value) ||
		isPlainDate(value) ||
		isPlainYearMonth(value) ||
		isZonedDateTime(value)

	return typeGuard ? result && typeGuard(value) : result
}

export function isPointAny<Ts extends ((value: unknown) => value is Point)[]>(
	value: unknown,
	typeGuards: [...Ts],
): value is TypeGuardType<Ts[number]> {
	return typeGuards.some((guard) => guard(value))
}

export function isInterval<T extends Point>(
	value: unknown,
	typeGuard?: TypeGuard<T>,
): value is Interval<T> {
	if (typeGuard) {
		return value instanceof Interval && typeGuard(value)
	}
	return value instanceof Interval
}

export function isIntervalLike<T extends Point>(
	value: unknown,
	typeGuard?: TypeGuard<T>,
): value is IntervalLike<T> {
	if (isInterval(value)) {
		if (typeGuard) {
			return typeGuard(value)
		}
		return true
	}

	const isLike =
		!!value &&
		isObject(value) &&
		'start' in value &&
		'end' in value &&
		isPoint(value.start) &&
		isPoint(value.end)

	if (isLike && typeGuard) {
		return typeGuard(value.start) && typeGuard(value.end)
	}
	return isLike
}

export function isIntervalLikeOneOf<
	Ts extends ((value: unknown) => value is Point)[],
>(
	value: unknown,
	typeGuards: [...Ts],
): value is IntervalLike<TypeGuardType<Ts[number]>> {
	if (!isIntervalLike(value)) {
		return false
	}

	return typeGuards.some((guard) => guard(value.start) && guard(value.end))
}

export function assertPoint<T extends Point>(
	value: unknown,
	typeGuard?: TypeGuard<T>,
	message?: string,
): asserts value is Point {
	invariant(
		typeGuard ? isPoint(value) && typeGuard(value) : isPoint(value),
		message,
	)
}

export function assertPlainDateTime(
	value: unknown,
	message?: string,
): asserts value is PlainDateTime {
	invariant(isPlainDateTime(value), message)
}

export function assertPlainTime(
	value: unknown,
	message?: string,
): asserts value is PlainTime {
	invariant(isPlainTime(value), message)
}

export function assertPlainYearMonth(
	value: unknown,
	message?: string,
): asserts value is PlainYearMonth {
	invariant(isPlainYearMonth(value), message)
}

export function assertPlainDate(
	value: unknown,
	message?: string,
): asserts value is PlainDate {
	invariant(isPlainDate(value), message)
}

export function assertInstant(
	value: unknown,
	message?: string,
): asserts value is Instant {
	invariant(isInstant(value), message)
}

export function assertZonedDateTime(
	value: unknown,
	message?: string,
): asserts value is ZonedDateTime {
	invariant(isZonedDateTime(value), message)
}

export function assertInterval<T extends Point>(
	value: unknown,
	typeGuard?: TypeGuard<T>,
	message?: string,
): asserts value is Interval<T> {
	invariant(
		typeGuard
			? isInterval(value) && typeGuard(value.start) && typeGuard(value.end)
			: isInterval(value),
		message,
	)
}

export function assertIntervalLike<T extends Point>(
	value: unknown,
	typeGuard?: TypeGuard<T>,
	message?: string,
): asserts value is IntervalLike<T> {
	invariant(
		typeGuard
			? isIntervalLike(value) && typeGuard(value.start) && typeGuard(value.end)
			: isIntervalLike(value),
		message,
	)
}
