import { describe, expect, it, test } from 'vitest'
import {
	Instant,
	Interval,
	PlainDate,
	PlainDateTime,
	PlainTime,
	PlainYearMonth,
	ZonedDateTime,
} from '../src/index.js'
import {
	assertInstant,
	assertInterval,
	assertIntervalLike,
	assertPlainDate,
	assertPlainDateTime,
	assertPlainTime,
	assertPlainYearMonth,
	assertPoint,
	assertZonedDateTime,
	isInstant,
	isInterval,
	isIntervalLike,
	isIntervalLikeOneOf,
	isPlainDate,
	isPlainDateTime,
	isPlainTime,
	isPlainYearMonth,
	isPoint,
	isPointAny,
	isZonedDateTime,
} from '../src/is.js'
import { TypeGuard } from '../src/type-utils.js'

// Helper function to create sample instances
function createSamples() {
	const instant = Instant.from('2023-01-01T12:00:00Z')
	const plainDate = PlainDate.from('2023-01-01')
	const plainDateTime = PlainDateTime.from('2023-01-01T12:00:00')
	const plainTime = PlainTime.from('12:00:00')
	const plainYearMonth = PlainYearMonth.from('2023-01')
	const zonedDateTime = ZonedDateTime.from(
		'2020-11-01T01:15-08:00[America/Los_Angeles]',
	)
	const dateInterval = Interval.from({
		start: plainDate,
		end: plainDate.add({ days: 7 }),
	})

	const intervalLike = {
		start: plainDate,
		end: plainDate.add({ days: 7 }),
	}

	return {
		instant,
		plainDate,
		plainDateTime,
		plainTime,
		plainYearMonth,
		zonedDateTime,
		dateInterval,
		intervalLike,
	}
}

describe('Temporal Type Guards', () => {
	const samples = createSamples()

	test.each([
		[isInstant, samples.instant],
		[isPlainTime, samples.plainTime],
		[isPlainDate, samples.plainDate],
		[isPlainDateTime, samples.plainDateTime],
		[isZonedDateTime, samples.zonedDateTime],
		[isPlainYearMonth, samples.plainYearMonth],
	])('%o, %o', (typeGuard, value) => {
		expect(typeGuard(value)).toBe(true)
		expect(typeGuard(value.toString())).toBe(true)
		expect(typeGuard(null)).toBe(false)
		expect(typeGuard(undefined)).toBe(false)
		expect(typeGuard({})).toBe(false)
	})
	test.each([
		[assertInstant, samples.instant],
		[assertPlainTime, samples.plainTime],
		[assertPlainDate, samples.plainDate],
		[assertPlainDateTime, samples.plainDateTime],
		[assertZonedDateTime, samples.zonedDateTime],
		[assertPlainYearMonth, samples.plainYearMonth],
	])('%o, %o', (assertion, value) => {
		expect(() => assertion(value)).to.not.toThrow()
		expect(() => assertion(value.toString())).to.not.toThrow()
		expect(() => assertion(null)).to.throw()
		expect(() => assertion(undefined)).to.throw()
		expect(() => assertion({})).to.throw()
	})
})

describe('Point Type Guards', () => {
	const samples = createSamples()
	const tests = [
		[samples.plainTime, isPlainTime],
		[samples.plainDate, isPlainDate],
		[samples.plainDateTime, isPlainDateTime],
		[samples.zonedDateTime, isZonedDateTime],
		[samples.plainYearMonth, isPlainYearMonth],
	] as const

	test.each(tests)('isPoint(%o, %o) -> true', (value, typeGuard) => {
		expect(isPoint(value)).toBe(true)
		expect(isPoint(value, typeGuard as TypeGuard<typeof value>)).toBe(true)
	})

	test.each(tests)('assertPoint(%i, %i)', (value, typeGuard) => {
		expect(() => assertPoint(value)).to.not.throw()
		expect(() =>
			assertPoint(value, typeGuard as TypeGuard<typeof value>),
		).to.not.throw()
	})

	const invalid = [
		[null],
		[undefined],
		[''],
		[{}],
		[samples.intervalLike],
		[samples.intervalLike],
		[samples.instant],
	] as const

	test.each(invalid)('isPoint(%o) -> false', (value) => {
		expect(isPoint(value)).toBe(false)
	})
	test.each(invalid)('assertPoint(%o) -> throw', (value) => {
		expect(() => assertPoint(value)).toThrow()
	})

	it('isPointAny should check against multiple type guards', () => {
		expect(isPointAny(samples.plainDate, [isPlainDate, isPlainDateTime])).toBe(
			true,
		)
		expect(
			isPointAny(samples.plainDateTime, [isPlainDate, isPlainDateTime]),
		).toBe(true)
		expect(
			isPointAny(samples.plainTime, [
				isPlainDate,
				isPlainDateTime,
				isZonedDateTime,
			]),
		).toBe(false)
	})
})

describe('Interval Type Guards', () => {
	const samples = createSamples()

	it('isInterval should identify Interval objects', () => {
		expect(isInterval(samples.dateInterval)).toBe(true)
		expect(isInterval(samples.intervalLike)).toBe(false)
	})

	it('isInterval should use the type guard parameter', () => {
		expect(isInterval(samples.dateInterval, isPlainDate)).toBe(true)
		expect(isInterval(samples.dateInterval, isPlainDateTime)).toBe(false)
	})

	it('isIntervalLike should identify both Interval objects and objects with start/end properties', () => {
		expect(isIntervalLike(samples.dateInterval)).toBe(true)
		expect(isIntervalLike(samples.intervalLike)).toBe(true)
		expect(
			isIntervalLike({ start: 'not a temporal', end: 'not a temporal' }),
		).toBe(false)
		expect(isIntervalLike(null)).toBe(false)
		expect(isIntervalLike(undefined)).toBe(false)
		expect(isIntervalLike({})).toBe(false)
	})

	it('isIntervalLike should respect the type guard parameter', () => {
		expect(isIntervalLike(samples.intervalLike, isPlainDate)).toBe(true)
		expect(isIntervalLike(samples.intervalLike, isPlainDateTime)).toBe(false)
		expect(isIntervalLike(samples.dateInterval, isPlainDate)).toBe(true)
	})

	it('isIntervalLikeOneOf should check against multiple type guards', () => {
		expect(
			isIntervalLikeOneOf(samples.intervalLike, [isPlainDate, isPlainDateTime]),
		).toBe(true)

		const dateTimeInterval = {
			start: samples.plainDateTime,
			end: samples.plainDateTime.add({ hours: 1 }),
		}

		expect(
			isIntervalLikeOneOf(dateTimeInterval, [isPlainDate, isPlainDateTime]),
		).toBe(true)
		expect(
			isIntervalLikeOneOf(dateTimeInterval, [isPlainTime, isPlainYearMonth]),
		).toBe(false)
	})

	it('assertInterval should throw for non-Interval values', () => {
		expect(() => assertInterval(samples.dateInterval)).not.toThrow()
		expect(() => assertInterval(samples.intervalLike)).toThrow()
		expect(() => assertInterval(null)).toThrow()
	})

	it('assertIntervalLike should throw for non-interval-like values', () => {
		expect(() => assertIntervalLike(samples.dateInterval)).not.toThrow()
		expect(() => assertIntervalLike(samples.intervalLike)).not.toThrow()
		expect(() => assertIntervalLike({})).toThrow()
		expect(() => assertIntervalLike(null)).toThrow()
	})
})
