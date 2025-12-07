import { Temporal } from 'temporal-polyfill'
import { Duration } from './duration.ts'
import { invariant } from './fn/misc.ts'
import { Instant } from './instant.ts'
import { Interval, type IntervalLike } from './interval.ts'
import { PlainDateTime, type PlainDateTimeLike } from './plain-date-time.ts'
import { PlainDate, type PlainDateLike } from './plain-date.ts'
import { PlainTime, type PlainTimeLike } from './plain-time.ts'
import { PlainYearMonth, type PlainYearMonthLike } from './plain-year-month.ts'
import type { Point } from './point.ts'
import type { Class, TypeGuard, TypeGuardType } from './type-utils.ts'
import { ZonedDateTime, type ZonedDateTimeLike } from './zoned-date-time.ts'

export type { TypeGuard, TypeGuardType } from './type-utils.ts'

export const isString = (value: unknown): value is string =>
  typeof value === 'string'
const isNumber = (value: unknown): value is number => typeof value === 'number'
export const isObject = (value: unknown): value is object =>
  typeof value === 'object'

export function isInstanceOf<T>(
  instance: unknown,
  class_: Class<T>,
): instance is T {
  if (instance === undefined || instance === null) {
    return false
  }

  const tag = Object.prototype.toString.call(instance)
  const className = class_.name

  return (
    Object.getPrototypeOf(instance) === class_.prototype ||
    tag === `[object Temporal.${className}]` ||
    tag === `[object ${className}]`
  )
}

export function isDuration(value: unknown): value is Duration {
  return isInstanceOf(value, Duration)
}

export function isInstant(value: unknown): value is Instant {
  return isInstanceOf(value, Instant)
}

export function isPlainDate(value: unknown): value is PlainDate {
  return isInstanceOf(value, PlainDate)
}

export function isPlainDateTime(value: unknown): value is PlainDateTime {
  return isInstanceOf(value, PlainDateTime)
}

export function isPlainTime(value: unknown): value is PlainTime {
  return isInstanceOf(value, PlainTime)
}

export function isPlainTimeLike(value: unknown): value is PlainTimeLike {
  return (
    !!value &&
    isObject(value) &&
    (('hour' in value && isNumber(value.hour)) ||
      ('minute' in value && isNumber(value.minute)) ||
      ('second' in value && isNumber(value.second)) ||
      ('millisecond' in value && isNumber(value.millisecond)) ||
      ('microsecond' in value && isNumber(value.microsecond)) ||
      ('nanosecond' in value && isNumber(value.nanosecond)))
  )
}

export function isTimeZoneLike(value: unknown): value is Temporal.TimeZoneLike {
  return isString(value) || isZonedDateTime(value)
}

export function isPlainDateTimeLike(
  value: unknown,
): value is PlainDateTimeLike {
  return (
    !!value &&
    isObject(value) &&
    (('era' in value && isString(value.era)) ||
      ('eraYear' in value && isNumber(value.eraYear)) ||
      ('year' in value && isNumber(value.year)) ||
      ('month' in value && isNumber(value.month)) ||
      ('monthCode' in value && isString(value.monthCode)) ||
      ('day' in value && isNumber(value.day)) ||
      ('hour' in value && isNumber(value.hour)) ||
      ('minute' in value && isNumber(value.minute)) ||
      ('second' in value && isNumber(value.second)) ||
      ('millisecond' in value && isNumber(value.millisecond)) ||
      ('microsecond' in value && isNumber(value.microsecond)) ||
      ('nanosecond' in value && isNumber(value.nanosecond)) ||
      ('calendar' in value && isCalendarLike(value.calendar)))
  )
}

export function isPlainDateLike(value: unknown): value is PlainDateLike {
  return (
    !!value &&
    isObject(value) &&
    (('era' in value && isString(value.era)) ||
      ('eraYear' in value && isNumber(value.eraYear)) ||
      ('year' in value && isNumber(value.year)) ||
      ('month' in value && isNumber(value.month)) ||
      ('monthCode' in value && isString(value.monthCode)) ||
      ('day' in value && isNumber(value.day)) ||
      ('calendar' in value && isCalendarLike(value.calendar)))
  )
}

export function isPlainYearMonthLike(
  value: unknown,
): value is PlainYearMonthLike {
  return (
    !!value &&
    isObject(value) &&
    (('era' in value && isString(value.era)) ||
      ('eraYear' in value && isNumber(value.eraYear)) ||
      ('year' in value && isNumber(value.year)) ||
      ('month' in value && isNumber(value.month)) ||
      ('monthCode' in value && isString(value.monthCode)) ||
      ('calendar' in value && isCalendarLike(value.calendar)))
  )
}

export function isZonedDateTimeLike(
  value: unknown,
): value is ZonedDateTimeLike {
  return (
    !!value &&
    isObject(value) &&
    (('era' in value && isString(value.era)) ||
      ('eraYear' in value && isNumber(value.eraYear)) ||
      ('year' in value && isNumber(value.year)) ||
      ('month' in value && isNumber(value.month)) ||
      ('monthCode' in value && isString(value.monthCode)) ||
      ('day' in value && isNumber(value.day)) ||
      ('hour' in value && isNumber(value.hour)) ||
      ('minute' in value && isNumber(value.minute)) ||
      ('second' in value && isNumber(value.second)) ||
      ('millisecond' in value && isNumber(value.millisecond)) ||
      ('microsecond' in value && isNumber(value.microsecond)) ||
      ('nanosecond' in value && isNumber(value.nanosecond)) ||
      ('offset' in value && isString(value.offset)) ||
      ('timeZone' in value && isTimeZoneLike(value.timeZone)) ||
      ('calendar' in value && isCalendarLike(value.calendar)))
  )
}

export function isPlainYearMonth(value: unknown): value is PlainYearMonth {
  return isInstanceOf(value, PlainYearMonth)
}

export function isZonedDateTime(value: unknown): value is ZonedDateTime {
  return isInstanceOf(value, ZonedDateTime)
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
    !!value &&
    isObject(value) &&
    'start' in value &&
    'end' in value &&
    (typeGuard ? typeGuard(value.start) : isPoint(value.start)) &&
    (typeGuard ? typeGuard(value.end) : isPoint(value.end))
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
// TODO: add Temporal.PlainMonthDay
export function isCalendarLike(value: unknown): value is Temporal.CalendarLike {
  return (
    isPlainDateTime(value) ||
    isPlainDate(value) ||
    isPlainYearMonth(value) ||
    isZonedDateTime(value) ||
    isString(value)
  )
}

export function assertPoint<T extends Point>(
  value: unknown,
  typeGuard?: TypeGuard<T>,
  message?: string,
): asserts value is Point {
  invariant(isPoint(value, typeGuard), message)
}

export function assertPointAny<
  Ts extends ((value: unknown) => value is Point)[],
>(
  value: unknown,
  typeGuards: [...Ts],
): asserts value is TypeGuardType<Ts[number]> {
  invariant(typeGuards.some((guard) => guard(value)))
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
