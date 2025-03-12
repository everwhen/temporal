import { Temporal } from 'temporal-polyfill'
import { Duration, DurationLike } from './duration.js'
import { isPlainTime } from './is.js'
import { Point } from './point.js'

export interface SequenceBounds<T extends Point> {
	start: T
	end: T
}

export interface SequenceDef<T extends Point> {
	start: T
	end: T
	step?: DurationLike
}

export interface SequenceItem<T extends Point> {
	previous?: T
	value: T
	next?: T
}

export class Sequence<T extends Point> implements Iterable<T> {
	readonly start: T
	readonly end: T
	readonly step: Duration
	private total: Duration

	constructor(start: T, end: T, step: DurationLike) {
		this.start = start
		this.end = end
		this.step = Duration.from(step)
		this.total = this.start.until(this.end)
	}

	static from<T extends Point>(bounds: SequenceDef<T>): Sequence<T> {
		const stepDefault: DurationLike = {}
		if (isPlainTime(bounds.start)) {
			stepDefault.hours = 1
		} else {
			stepDefault.days = 1
		}
		return new Sequence(bounds.start, bounds.end, bounds.step ?? stepDefault)
	}

	*[Symbol.iterator](): Iterator<T> {
		let current = this.start
		let accumulated = Duration.from('PT0S')
		const opts: Temporal.DurationArithmeticOptions = {}
		if (!isPlainTime(this.start)) {
			opts.relativeTo = this.start
		}
		yield current

		while (current.compare(this.end) < 0) {
			accumulated = accumulated.add(this.step, opts)
			if (accumulated.compare(this.total, opts) > 0) {
				break
			}

			current = current.add(this.step) as T

			yield current
		}
	}

	get bounds(): SequenceBounds<T> {
		return { start: this.start, end: this.end }
	}

	*items(): Generator<SequenceItem<T>> {
		let accumulated = Duration.from('PT0S')
		const item: SequenceItem<T> = {
			value: this.start,
			next: this.start.add(this.step) as T,
		}
		const opts: Temporal.DurationArithmeticOptions = {}
		if (!isPlainTime(this.start)) {
			opts.relativeTo = this.start
		}

		yield item

		while (item.value.compare(this.end) < 0) {
			accumulated = accumulated.add(this.step, opts)
			if (accumulated.compare(this.total, opts) > 0) {
				break
			}
			item.previous = item.value
			item.value = item.value.add(this.step) as T

			const nextAccumulated = accumulated.add(this.step, opts)
			if (nextAccumulated.compare(this.total, opts) <= 0) {
				item.next = item.value.add(this.step) as T
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
		bounds: Partial<SequenceBounds<T>> & { step?: DurationLike },
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

	toJSON() {
		return {
			start: this.start.toString(),
			end: this.end.toString(),
			step: this.step.toString(),
		}
	}
}
