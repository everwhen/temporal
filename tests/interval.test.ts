import { describe, expect, it } from 'vitest'
import { Interval } from '../src/interval.js'
import { PlainDateTime } from '../src/plain-date-time.js'

describe('Interval', () => {
	const createDateTime = (year: number, month: number, day: number) => {
		return new PlainDateTime(year, month, day)
	}

	describe('constructor and static methods', () => {
		it('should create a valid interval', () => {
			const start = createDateTime(2024, 1, 1)
			const end = createDateTime(2024, 1, 2)
			const interval = new Interval(start, end)

			expect(interval.start).toBe(start)
			expect(interval.end).toBe(end)
		})

		it('should throw error when end is before start', () => {
			const start = createDateTime(2024, 1, 2)
			const end = createDateTime(2024, 1, 1)

			expect(() => new Interval(start, end)).toThrow(
				'Invalid interval: end cannot be before start',
			)
		})

		it('should create interval from IntervalLike object', () => {
			const start = createDateTime(2024, 1, 1)
			const end = createDateTime(2024, 1, 2)
			const interval = Interval.from({ start, end })

			expect(interval).toBeInstanceOf(Interval)
			expect(interval.start).toBe(start)
			expect(interval.end).toBe(end)
		})
	})

	describe('isBefore', () => {
		it('should return true when interval is completely before other', () => {
			const interval1 = new Interval(
				createDateTime(2024, 1, 1),
				createDateTime(2024, 1, 2),
			)
			const interval2 = new Interval(
				createDateTime(2024, 1, 3),
				createDateTime(2024, 1, 4),
			)

			expect(interval1.isBefore(interval2)).toBe(true)
		})

		it('should return false when intervals overlap', () => {
			const interval1 = new Interval(
				createDateTime(2024, 1, 1),
				createDateTime(2024, 1, 3),
			)
			const interval2 = new Interval(
				createDateTime(2024, 1, 2),
				createDateTime(2024, 1, 4),
			)

			expect(interval1.isBefore(interval2)).toBe(false)
		})
	})

	describe('isAfter', () => {
		it('should return true when interval is completely after other', () => {
			const interval1 = new Interval(
				createDateTime(2024, 1, 3),
				createDateTime(2024, 1, 4),
			)
			const interval2 = new Interval(
				createDateTime(2024, 1, 1),
				createDateTime(2024, 1, 2),
			)

			expect(interval1.isAfter(interval2)).toBe(true)
		})

		it('should return false when intervals overlap', () => {
			const interval1 = new Interval(
				createDateTime(2024, 1, 2),
				createDateTime(2024, 1, 4),
			)
			const interval2 = new Interval(
				createDateTime(2024, 1, 1),
				createDateTime(2024, 1, 3),
			)

			expect(interval1.isAfter(interval2)).toBe(false)
		})
	})

	describe('equals', () => {
		it('should return true for intervals with same start and end', () => {
			const start = createDateTime(2024, 1, 1)
			const end = createDateTime(2024, 1, 2)
			const interval1 = new Interval(start, end)
			const interval2 = new Interval(start, end)

			expect(interval1.equals(interval2)).toBe(true)
		})

		it('should return false for intervals with different start', () => {
			const interval1 = new Interval(
				createDateTime(2024, 1, 1),
				createDateTime(2024, 1, 2),
			)
			const interval2 = new Interval(
				createDateTime(2024, 1, 2),
				createDateTime(2024, 1, 2),
			)

			expect(interval1.equals(interval2)).toBe(false)
		})

		it('should return false for intervals with different end', () => {
			const interval1 = new Interval(
				createDateTime(2024, 1, 1),
				createDateTime(2024, 1, 2),
			)
			const interval2 = new Interval(
				createDateTime(2024, 1, 1),
				createDateTime(2024, 1, 3),
			)

			expect(interval1.equals(interval2)).toBe(false)
		})
	})

	describe('overlaps', () => {
		it('should return true when intervals overlap', () => {
			const interval1 = new Interval(
				createDateTime(2024, 1, 1),
				createDateTime(2024, 1, 3),
			)
			const interval2 = new Interval(
				createDateTime(2024, 1, 2),
				createDateTime(2024, 1, 4),
			)

			expect(interval1.overlaps(interval2)).toBe(true)
		})

		it('should return false when intervals do not overlap', () => {
			const interval1 = new Interval(
				createDateTime(2024, 1, 1),
				createDateTime(2024, 1, 2),
			)
			const interval2 = new Interval(
				createDateTime(2024, 1, 3),
				createDateTime(2024, 1, 4),
			)

			expect(interval1.overlaps(interval2)).toBe(false)
		})

		it('should return true for intervals that share an endpoint', () => {
			const interval1 = new Interval(
				PlainDateTime.from('2023-01-01T09:00'),
				PlainDateTime.from('2023-01-01T10:00'),
			)
			const interval2 = new Interval(
				PlainDateTime.from('2023-01-01T10:00'),
				PlainDateTime.from('2023-01-01T11:00'),
			)

			expect(interval1.overlaps(interval2, { inclusive: true })).toBe(true)
		})
	})

	describe('contains', () => {
		it('should return true when point is within interval', () => {
			const interval = new Interval(
				createDateTime(2024, 1, 1),
				createDateTime(2024, 1, 3),
			)
			const point = createDateTime(2024, 1, 2)

			expect(interval.contains(point)).toBe(true)
		})

		it('should return true when point is at interval start', () => {
			const start = createDateTime(2024, 1, 1)
			const interval = new Interval(start, createDateTime(2024, 1, 3))

			expect(interval.contains(start)).toBe(true)
		})

		it('should return true when point is at interval end', () => {
			const end = createDateTime(2024, 1, 3)
			const interval = new Interval(createDateTime(2024, 1, 1), end)

			expect(interval.contains(end)).toBe(true)
		})

		it('should return false when point is before interval', () => {
			const interval = new Interval(
				createDateTime(2024, 1, 2),
				createDateTime(2024, 1, 3),
			)
			const point = createDateTime(2024, 1, 1)

			expect(interval.contains(point)).toBe(false)
		})

		it('should return false when point is after interval', () => {
			const interval = new Interval(
				createDateTime(2024, 1, 1),
				createDateTime(2024, 1, 2),
			)
			const point = createDateTime(2024, 1, 3)

			expect(interval.contains(point)).toBe(false)
		})
	})

	describe('toString', () => {
		it('should return string representation of interval', () => {
			const start = createDateTime(2024, 1, 1)
			const end = createDateTime(2024, 1, 2)
			const interval = new Interval(start, end)

			expect(interval.toString()).toBe(
				`[${start.toString()}, ${end.toString()}]`,
			)
		})
	})
})
