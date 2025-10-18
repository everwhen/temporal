import { describe, expect, it } from 'vitest'
import { Interval } from '../src/interval.ts'
import { isPlainDate } from '../src/is.ts'
import { PlainDate } from '../src/plain-date.ts'
import { dateInterval, dateTimeInterval } from './test-utils.ts'

describe('Interval', () => {
  describe('constructor', () => {
    it('creates a valid interval with start and end', () => {
      const interval = dateInterval('2023-01-01', '2023-01-31')

      expect(interval.start.equals(PlainDate.from('2023-01-01'))).toBe(true)
      expect(interval.end.equals(PlainDate.from('2023-01-31'))).toBe(true)
    })

    it('throws an error when end is before start', () => {
      expect(() => dateInterval('2023-01-31', '2023-01-01')).toThrow()
    })
  })

  describe('static from()', () => {
    it('creates an interval from an interval-like object', () => {
      const intervalLike = {
        start: PlainDate.from('2023-01-01'),
        end: PlainDate.from('2023-01-31'),
      }
      const interval = Interval.from(intervalLike)

      expect(interval.start.equals(PlainDate.from('2023-01-01'))).toBe(true)
      expect(interval.end.equals(PlainDate.from('2023-01-31'))).toBe(true)
    })

    it('creates a new interval from an existing interval', () => {
      const original = dateInterval('2023-01-01', '2023-01-31')
      const copy = Interval.from(original)

      expect(copy).not.toBe(original) // Not the same reference
      expect(copy.equals(original)).toBe(true) // But equal content
    })

    it('creates a new interval instance from a serialized interval', () => {
      const original = dateInterval('2023-01-01', '2023-01-31')
      const serialized = original.toJSON()

      const deserialized = Interval.from(serialized)
      expect(isPlainDate(deserialized.start)).toBeTruthy()
      expect(isPlainDate(deserialized.end)).toBeTruthy()
      expect(original.start.toString()).toEqual(deserialized.start.toString())
      expect(original.end.toString()).toEqual(deserialized.end.toString())
    })
  })

  describe('static compare()', () => {
    it('compares intervals by start date first', () => {
      const earlier = dateInterval('2023-01-01', '2023-01-31')
      const later = dateInterval('2023-02-01', '2023-02-28')

      expect(Interval.compare(earlier, later)).toBeLessThan(0)
      expect(Interval.compare(later, earlier)).toBeGreaterThan(0)
    })

    it('compares intervals by end date when start dates are equal', () => {
      const shorter = dateInterval('2023-01-01', '2023-01-15')
      const longer = dateInterval('2023-01-01', '2023-01-31')

      expect(Interval.compare(shorter, longer)).toBeLessThan(0)
      expect(Interval.compare(longer, shorter)).toBeGreaterThan(0)
    })

    it('returns 0 for equal intervals', () => {
      const interval1 = dateInterval('2023-01-01', '2023-01-31')
      const interval2 = dateInterval('2023-01-01', '2023-01-31')

      expect(Interval.compare(interval1, interval2)).toBe(0)
    })
  })

  describe('static overlaps()', () => {
    it('returns true for overlapping intervals', () => {
      const a = dateInterval('2023-01-01', '2023-01-15')
      const b = dateInterval('2023-01-10', '2023-01-31')

      expect(Interval.overlaps(a, b)).toBe(true)
      expect(Interval.overlaps(b, a)).toBe(true)
    })

    it('returns false for non-overlapping intervals', () => {
      const a = dateInterval('2023-01-01', '2023-01-15')
      const b = dateInterval('2023-01-16', '2023-01-31')

      expect(Interval.overlaps(a, b)).toBe(false)
      expect(Interval.overlaps(b, a)).toBe(false)
    })

    it('handles inclusive option for adjacent intervals', () => {
      const a = dateInterval('2023-01-01', '2023-01-15')
      const b = dateInterval('2023-01-15', '2023-01-31')

      expect(Interval.overlaps(a, b)).toBe(false) // Default behavior
      expect(Interval.overlaps(a, b, { inclusive: true })).toBe(true)
    })
  })

  describe('validate()', () => {
    it('does not throw for valid intervals', () => {
      const interval = dateInterval('2023-01-01', '2023-01-31')

      expect(() => interval.validate()).not.toThrow()
    })

    it('throws for invalid intervals where end is before start', () => {
      const start = PlainDate.from('2023-01-31')
      const end = PlainDate.from('2023-01-01')

      expect(() => new Interval(start, end)).toThrow()
    })
  })

  describe('isBefore()', () => {
    it('returns true if the interval ends before another interval starts', () => {
      const earlier = dateInterval('2023-01-01', '2023-01-15')
      const later = dateInterval('2023-01-16', '2023-01-31')

      expect(earlier.isBefore(later)).toBe(true)
      expect(later.isBefore(earlier)).toBe(false)
    })

    it('returns true if the interval ends before a point', () => {
      const interval = dateInterval('2023-01-01', '2023-01-15')
      const point = PlainDate.from('2023-01-16')

      expect(interval.isBefore(point)).toBe(true)
    })

    it('returns false for overlapping intervals', () => {
      const a = dateInterval('2023-01-01', '2023-01-15')
      const b = dateInterval('2023-01-10', '2023-01-31')

      expect(a.isBefore(b)).toBe(false)
      expect(b.isBefore(a)).toBe(false)
    })
  })

  describe('isAfter()', () => {
    it('returns true if the interval starts after another interval ends', () => {
      const earlier = dateInterval('2023-01-01', '2023-01-15')
      const later = dateInterval('2023-01-16', '2023-01-31')

      expect(later.isAfter(earlier)).toBe(true)
      expect(earlier.isAfter(later)).toBe(false)
    })

    it('returns true if the interval starts after a point', () => {
      const interval = dateInterval('2023-01-16', '2023-01-31')
      const point = PlainDate.from('2023-01-15')

      expect(interval.isAfter(point)).toBe(true)
    })

    it('returns false for overlapping intervals', () => {
      const a = dateInterval('2023-01-01', '2023-01-15')
      const b = dateInterval('2023-01-10', '2023-01-31')

      expect(a.isAfter(b)).toBe(false)
      expect(b.isAfter(a)).toBe(false)
    })
  })

  describe('equals()', () => {
    it('returns true for intervals with equal start and end points', () => {
      const a = dateInterval('2023-01-01', '2023-01-31')
      const b = dateInterval('2023-01-01', '2023-01-31')

      expect(a.equals(b)).toBe(true)
      expect(b.equals(a)).toBe(true)
    })

    it('returns false for intervals with different start points', () => {
      const a = dateInterval('2023-01-01', '2023-01-31')
      const b = dateInterval('2023-01-02', '2023-01-31')

      expect(a.equals(b)).toBe(false)
    })

    it('returns false for intervals with different end points', () => {
      const a = dateInterval('2023-01-01', '2023-01-30')
      const b = dateInterval('2023-01-01', '2023-01-31')

      expect(a.equals(b)).toBe(false)
    })
  })

  describe('overlaps()', () => {
    it('returns true for overlapping intervals', () => {
      const a = dateInterval('2023-01-01', '2023-01-15')
      const b = dateInterval('2023-01-10', '2023-01-31')

      expect(a.overlaps(b)).toBe(true)
      expect(b.overlaps(a)).toBe(true)
    })

    it('returns false for non-overlapping intervals', () => {
      const a = dateInterval('2023-01-01', '2023-01-15')
      const b = dateInterval('2023-01-16', '2023-01-31')

      expect(a.overlaps(b)).toBe(false)
      expect(b.overlaps(a)).toBe(false)
    })

    it('handles inclusive option for adjacent intervals', () => {
      const a = dateInterval('2023-01-01', '2023-01-15')
      const b = dateInterval('2023-01-15', '2023-01-31')

      expect(a.overlaps(b)).toBe(false) // Default behavior
      expect(a.overlaps(b, { inclusive: true })).toBe(true)
    })

    it('works with interval-like objects', () => {
      const a = dateInterval('2023-01-01', '2023-01-15')
      const b = {
        start: PlainDate.from('2023-01-10'),
        end: PlainDate.from('2023-01-31'),
      }

      expect(a.overlaps(b)).toBe(true)
    })
  })

  describe('contains()', () => {
    it('returns true if the interval contains a point', () => {
      const interval = dateInterval('2023-01-01', '2023-01-31')
      const point = PlainDate.from('2023-01-15')

      expect(interval.contains(point)).toBe(true)
    })

    it('returns false if the interval does not contain a point', () => {
      const interval = dateInterval('2023-01-01', '2023-01-31')
      const point = PlainDate.from('2023-02-01')

      expect(interval.contains(point)).toBe(false)
    })

    it('returns true if the interval completely contains another interval', () => {
      const outer = dateInterval('2023-01-01', '2023-01-31')
      const inner = dateInterval('2023-01-10', '2023-01-20')

      expect(outer.contains(inner)).toBe(true)
      expect(inner.contains(outer)).toBe(false)
    })

    it('returns false for partially overlapping intervals', () => {
      const a = dateInterval('2023-01-01', '2023-01-20')
      const b = dateInterval('2023-01-10', '2023-01-31')

      expect(a.contains(b)).toBe(false)
      expect(b.contains(a)).toBe(false)
    })
  })

  describe('toJSON()', () => {
    it('serializes date intervals', () => {
      const interval = dateInterval('2023-01-01', '2023-01-31')
      const json = interval.toJSON()

      expect(json).toMatchInlineSnapshot(
        `"[{"start":1,"end":3},["PlainDate",2],"2023-01-01",["PlainDate",4],"2023-01-31"]"`,
      )
    })

    it('serializes datetime intervals', () => {
      const dateTime = dateTimeInterval(
        '2023-01-01T12:30:45',
        '2023-01-31T18:15:30',
      )
      const json = dateTime.toJSON()

      expect(json).toMatchInlineSnapshot(
        `"[{"start":1,"end":3},["PlainDateTime",2],"2023-01-01T12:30:45",["PlainDateTime",4],"2023-01-31T18:15:30"]"`,
      )
    })
  })

  describe('toString()', () => {
    it('returns a string representation of the interval', () => {
      const interval = dateInterval('2023-01-01', '2023-01-31')

      expect(interval.toString()).toBe('[2023-01-01, 2023-01-31]')
    })

    it('works with datetime intervals', () => {
      const interval = dateTimeInterval(
        '2023-01-01T12:30:45',
        '2023-01-31T18:15:30',
      )

      expect(interval.toString()).toBe(
        '[2023-01-01T12:30:45, 2023-01-31T18:15:30]',
      )
    })
  })

  describe('duration', () => {
    it('returns the duration between start and end dates', () => {
      const interval = dateInterval('2023-01-01', '2023-01-31')
      const duration = interval.duration

      expect(duration.days).toBe(30)
    })

    it('works with datetime intervals', () => {
      const interval = dateTimeInterval(
        '2023-01-01T12:00:00',
        '2023-01-01T14:30:00',
      )
      const duration = interval.duration

      expect(duration.hours).toBe(2)
      expect(duration.minutes).toBe(30)
    })
  })
})
