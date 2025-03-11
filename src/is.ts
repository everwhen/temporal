import invariant from 'tiny-invariant'
import { Instant } from './instant.js'
import { Interval, IntervalLike } from './interval.js'
import { PlainDateTime } from './plain-date-time.js'
import { PlainDate } from './plain-date.js'
import { PlainTime } from './plain-time.js'
import { PlainYearMonth } from './plain-year-month.js'
import { Point } from './point.js'
import { Class, TypeGuard, TypeGuardType } from './type-utils.js'
import { ZonedDateTime } from './zoned-date-time.js'

function tryIt(fn: () => void): boolean {
	try {
		fn()
		return true
	} catch (error) {
		return false
	}
}
export const isString = (value: unknown): value is string =>
	typeof value === 'string'
export const isObject = (value: unknown): value is object =>
	typeof value === 'object'
export function isInstanceOf<T>(
	instance: unknown,
	class_: Class<T>,
): instance is T {
	if (instance === undefined || instance === null) {
		return false
	}

	return Object.getPrototypeOf(instance) === class_.prototype
}

export function isTemporalKind<T>(
	value: unknown,
	class_: Class<T>,
): value is T {
	return isString(value)
		? tryIt(
				() =>
					'from' in class_ &&
					typeof class_.from === 'function' &&
					class_.from(value),
		  )
		: isInstanceOf(value, class_)
}

export function isInstant(value: unknown): value is Instant {
	return isTemporalKind(value, Instant)
}

export function isPlainDate(value: unknown): value is PlainDate {
	return isTemporalKind(value, PlainDate)
}

export function isPlainDateTime(value: unknown): value is PlainDateTime {
	return isTemporalKind(value, PlainDateTime)
}

export function isPlainTime(value: unknown): value is PlainTime {
	return isTemporalKind(value, PlainTime)
}

export function isPlainYearMonth(value: unknown): value is PlainYearMonth {
	return isTemporalKind(value, PlainYearMonth)
}

export function isZonedDateTime(value: unknown): value is ZonedDateTime {
	return isTemporalKind(value, ZonedDateTime)
}

export function isPoint<T extends Point>(
	value: unknown,
	typeGuard?: TypeGuard<T>,
): value is T {
	return typeGuard
		? typeGuard(value)
		: isPlainTime(value) ||
				isPlainDateTime(value) ||
				isPlainDate(value) ||
				isPlainYearMonth(value) ||
				isZonedDateTime(value)
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
		return (
			isInstanceOf(value, Interval) &&
			typeGuard(value.start) &&
			typeGuard(value.end)
		)
	}
	return isInstanceOf(value, Interval)
}

export function isIntervalLike<T extends Point>(
	value: unknown,
	typeGuard?: TypeGuard<T>,
): value is IntervalLike<T> {
	return (
		isInterval(value, typeGuard) ||
		(!!value &&
			isObject(value) &&
			'start' in value &&
			'end' in value &&
			(typeGuard ? typeGuard(value.start) : isPoint(value.start)) &&
			(typeGuard ? typeGuard(value.end) : isPoint(value.end)))
	)
}

export function isIntervalLikeOneOf<
	Ts extends ((value: unknown) => value is Point)[],
>(
	value: unknown,
	typeGuards: [...Ts],
): value is IntervalLike<TypeGuardType<Ts[number]>> {
	return (
		isIntervalLike(value) &&
		typeGuards.some((guard) => guard(value.start) && guard(value.end))
	)
}

export function assertPoint<T extends Point>(
	value: unknown,
	typeGuard?: TypeGuard<T>,
	message?: string,
): asserts value is Point {
	invariant(isPoint(value, typeGuard), message)
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
	invariant(isInterval(value, typeGuard), message)
}

export function assertIntervalLike<T extends Point>(
	value: unknown,
	typeGuard?: TypeGuard<T>,
	message?: string,
): asserts value is IntervalLike<T> {
	invariant(isIntervalLike(value, typeGuard), message)
}
