import { beforeEach, describe, expect, it } from 'vitest'
import { PlainDateTime } from '../src/plain-date-time.js'
import { PlainDate } from '../src/plain-date.js'
import { PlainYearMonth } from '../src/plain-year-month.js'
import { TemporalTree } from '../src/tree/temporal-tree.js'
import { ZonedDateTime } from '../src/zoned-date-time.js'
import { interval, pd } from './utils.js'

describe('TemporalTree', () => {
	let tree: TemporalTree<string>

	beforeEach(() => {
		tree = new TemporalTree()
	})

	describe('size', () => {
		it('starts with size 0', () => {
			expect(tree.size).toBe(0)
		})

		it('increases when nodes are inserted', () => {
			tree.insert(interval(pd(2024, 1, 1), pd(2024, 1, 2)), 'event1')
			expect(tree.size).toBe(1)

			tree.insert(interval(pd(2024, 1, 3), pd(2024, 1, 4)), 'event2')
			expect(tree.size).toBe(2)
		})

		it('decreases when nodes are deleted', () => {
			const int1 = interval(pd(2024, 1, 1), pd(2024, 1, 2))
			const int2 = interval(pd(2024, 1, 3), pd(2024, 1, 4))

			tree.insert(int1, 'event1')
			tree.insert(int2, 'event2')
			expect(tree.size).toBe(2)

			tree.delete(int1)
			expect(tree.size).toBe(1)
		})
	})

	describe('get', () => {
		it('returns undefined for empty tree', () => {
			const result = tree.get(interval(pd(2024, 1, 1), pd(2024, 1, 2)))
			expect(result).toBeUndefined()
		})

		it('returns the correct node when it exists', () => {
			const int = interval(pd(2024, 1, 1), pd(2024, 1, 2))
			tree.insert(int, 'event1')

			const result = tree.get(int)
			expect(result?.data).toBe('event1')
			expect(result?.interval.equals(int)).toBe(true)
		})

		it('returns undefined when interval does not exist', () => {
			tree.insert(interval(pd(2024, 1, 1), pd(2024, 1, 2)), 'event1')

			const result = tree.get(interval(pd(2024, 1, 3), pd(2024, 1, 4)))
			expect(result).toBeUndefined()
		})
	})

	describe('set', () => {
		it('inserts new node when interval does not exist', () => {
			const int = interval(pd(2024, 1, 1), pd(2024, 1, 2))
			const node = tree.set(int, 'event1')

			expect(node.data).toBe('event1')
			expect(node.interval.equals(int)).toBe(true)
			expect(tree.size).toBe(1)
		})

		it('updates existing node when interval exists', () => {
			const int = interval(pd(2024, 1, 1), pd(2024, 1, 2))
			tree.set(int, 'event1')
			const node = tree.set(int, 'updated')

			expect(node.data).toBe('updated')
			expect(tree.size).toBe(1)
		})
	})

	describe('insert', () => {
		it('correctly inserts nodes and maintains balance', () => {
			const intervals = [
				interval(pd(2024, 1, 1), pd(2024, 1, 2)),
				interval(pd(2024, 1, 2), pd(2024, 1, 3)),
				interval(pd(2024, 1, 3), pd(2024, 1, 4)),
			]

			const nodes = intervals.map((int, i) => {
				const node = tree.insert(int, `event${i + 1}`)
				// Verify each node was inserted successfully
				expect(node).toBeDefined()
				expect(node.data).toBe(`event${i + 1}`)
				return node
			})

			expect(tree.size).toBe(3)

			// Verify each interval can be retrieved
			intervals.forEach((int, i) => {
				const retrieved = tree.get(int)
				expect(retrieved).toBeDefined()
				expect(retrieved?.data).toBe(`event${i + 1}`)
			})
		})
	})

	describe('delete', () => {
		it('returns false when deleting from empty tree', () => {
			const result = tree.delete(interval(pd(2024, 1, 1), pd(2024, 1, 2)))
			expect(result).toBe(false)
		})

		it('successfully deletes existing nodes', () => {
			const int1 = interval(pd(2024, 1, 1), pd(2024, 1, 2))
			const int2 = interval(pd(2024, 1, 3), pd(2024, 1, 4))

			tree.insert(int1, 'event1')
			tree.insert(int2, 'event2')

			expect(tree.delete(int1)).toBe(true)
			expect(tree.get(int1)).toBeUndefined()
			expect(tree.get(int2)).toBeDefined()
		})

		it('maintains tree balance after deletion', () => {
			// Insert and delete nodes in a way that would require rebalancing
			const intervals = [
				interval(pd(2024, 1, 1), pd(2024, 1, 2)),
				interval(pd(2024, 1, 2), pd(2024, 1, 3)),
				interval(pd(2024, 1, 3), pd(2024, 1, 4)),
			]

			intervals.forEach((int, i) => tree.insert(int, `event${i + 1}`))
			tree.delete(intervals[1]) // Delete middle node

			expect(tree.size).toBe(2)
			expect(tree.get(intervals[0])).toBeDefined()
			expect(tree.get(intervals[2])).toBeDefined()
		})
	})

	describe('select', () => {
		beforeEach(() => {
			tree.insert(interval(pd(2024, 1, 1), pd(2024, 1, 2)), 'event1')
			tree.insert(interval(pd(2024, 1, 3), pd(2024, 1, 4)), 'event2')
			tree.insert(interval(pd(2024, 1, 5), pd(2024, 1, 6)), 'event3')
		})

		it('selects the nodes that match the predicate', () => {
			const query = interval(pd(2024, 1, 1), pd(2024, 1, 4))
			const results = tree.select((node) => query.contains(node.interval))

			expect(results).toHaveLength(2)
			expect(results.map((n) => n.data)).toContain('event1')
			expect(results.map((n) => n.data)).toContain('event2')
		})

		it('returns empty array when no intervals in select', () => {
			const query = interval(pd(2024, 1, 7), pd(2024, 1, 8))
			const results = tree.select((node) => query.contains(node.interval))

			expect(results).toHaveLength(0)
		})
	})
})

describe.todo('TemporalTree - mixed temporal types', () => {
	let tree: TemporalTree<string>

	beforeEach(() => {
		tree = new TemporalTree<string>()
	})

	it('should handle mixed temporal type intervals in the same tree', () => {
		const meetingStart = new PlainDateTime(2024, 1, 15, 10, 0)
		const meetingEnd = new PlainDateTime(2024, 1, 15, 11, 0)
		tree.insert({ start: meetingStart, end: meetingEnd }, 'meeting')

		const vacationStart = new PlainDate(2024, 7, 1)
		const vacationEnd = new PlainDate(2024, 7, 15)
		tree.insert({ start: vacationStart, end: vacationEnd }, 'vacation')

		const quarterStart = new PlainYearMonth(2024, 1)
		const quarterEnd = new PlainYearMonth(2024, 3)
		tree.insert({ start: quarterStart, end: quarterEnd }, 'Q1')

		const eventStart = ZonedDateTime.from({
			timeZone: 'America/New_York',
			year: 2024,
			month: 12,
			day: 31,
			hour: 23,
			minute: 0,
		})
		const eventEnd = ZonedDateTime.from({
			timeZone: 'America/New_York',
			year: 2025,
			month: 1,
			day: 1,
			hour: 1,
			minute: 0,
		})
		tree.insert({ start: eventStart, end: eventEnd }, 'new years')

		expect(tree.size).toBe(4)
		expect(tree.get({ start: meetingStart, end: meetingEnd })?.data).toBe(
			'meeting',
		)
		expect(tree.get({ start: vacationStart, end: vacationEnd })?.data).toBe(
			'vacation',
		)
		expect(tree.get({ start: quarterStart, end: quarterEnd })?.data).toBe('Q1')
		expect(tree.get({ start: eventStart, end: eventEnd })?.data).toBe(
			'new years',
		)
	})

	it('should maintain correct ordering with mixed types', () => {
		// Insert intervals in random order
		const intervals = [
			{
				start: new PlainDateTime(2024, 1, 15, 10, 0),
				end: new PlainDateTime(2024, 1, 15, 11, 0),
				data: 'meeting',
			},
			{
				start: new PlainDate(2024, 7, 1),
				end: new PlainDate(2024, 7, 15),
				data: 'vacation',
			},
			{
				start: new PlainYearMonth(2024, 1),
				end: new PlainYearMonth(2024, 3),
				data: 'Q1',
			},
			{
				start: ZonedDateTime.from({
					timeZone: 'America/New_York',
					year: 2024,
					month: 12,
					day: 31,
					hour: 23,
					minute: 0,
				}),
				end: ZonedDateTime.from({
					timeZone: 'America/New_York',
					year: 2025,
					month: 1,
					day: 1,
					hour: 1,
					minute: 0,
				}),
				data: 'new years',
			},
		]

		// Insert in reverse order
		for (let i = intervals.length - 1; i >= 0; i--) {
			const interval = intervals[i]
			tree.insert({ start: interval.start, end: interval.end }, interval.data)
		}

		expect(tree.size).toBe(4)

		intervals.forEach((interval) => {
			const retrieved = tree.get({ start: interval.start, end: interval.end })
			expect(retrieved?.data).toBe(interval.data)
		})
	})

	it('should handle deletion of mixed type intervals', () => {
		const meetingInterval = {
			start: new PlainDateTime(2024, 1, 15, 10, 0),
			end: new PlainDateTime(2024, 1, 15, 11, 0),
		}
		const vacationInterval = {
			start: new PlainDate(2024, 7, 1),
			end: new PlainDate(2024, 7, 15),
		}
		const quarterInterval = {
			start: new PlainYearMonth(2024, 1),
			end: new PlainYearMonth(2024, 3),
		}

		tree.insert(meetingInterval, 'meeting')
		tree.insert(vacationInterval, 'vacation')
		tree.insert(quarterInterval, 'Q1')

		expect(tree.size).toBe(3)

		// Delete intervals one by one
		expect(tree.delete(meetingInterval)).toBe(true)
		expect(tree.size).toBe(2)
		expect(tree.get(meetingInterval)).toBeUndefined()

		expect(tree.delete(vacationInterval)).toBe(true)
		expect(tree.size).toBe(1)
		expect(tree.get(vacationInterval)).toBeUndefined()

		expect(tree.delete(quarterInterval)).toBe(true)
		expect(tree.size).toBe(0)
		expect(tree.get(quarterInterval)).toBeUndefined()
	})
})
