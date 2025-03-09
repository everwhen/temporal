import { Interval, IntervalLike } from '../interval.js'
import { Point } from '../point.js'
import { TemporalNode } from './temporal-node.js'

export class TemporalTree<Data, T extends Point = Point> {
	private root: TemporalNode<Data, T> | null
	private _size = 0

	constructor() {
		this.root = null
	}

	private _compareIntervals(a: Interval<T>, b: Interval<T>): number {
		if (a.equals(b)) return 0

		const startComparison = a.start.compare(b.start)
		if (startComparison !== 0) {
			return startComparison
		}
		return a.end.compare(b.end)
	}

	get(interval: IntervalLike<T>): TemporalNode<Data, T> | undefined {
		const node = Interval.from(interval)

		let curr = this.root
		while (curr) {
			if (
				node.start.equals(curr.interval.start) &&
				node.end.equals(curr.interval.end)
			) {
				return curr
			}
			curr = node.isBefore(curr.interval) ? curr.left : curr.right
		}
	}

	set(interval: IntervalLike<T>, data: Data): TemporalNode<Data, T> {
		const target = Interval.from<T>(interval)

		if (!this.root) {
			return this.insert(interval, data)
		}

		let next: TemporalNode<Data, T> | null = this.root
		let curr = next
		let comparison = 0

		do {
			curr = next
			comparison = this._compareIntervals(target, curr.interval)

			if (comparison === 0) {
				curr.data = data
				return curr
			}

			next = comparison < 0 ? curr.left : curr.right
		} while (next)

		const node = new TemporalNode<Data, T>(interval, data)

		if (comparison < 0) {
			curr.left = node
		} else {
			curr.right = node
		}

		this.root = this._rebalance(this.root)
		this._size++

		return node
	}

	/**
	 * Inserts a new interval into the tree
	 * @param interval The interval to insert
	 * @param data Optional data to associate with the interval
	 * @returns The inserted node
	 */
	insert(interval: IntervalLike<T>, data: Data): TemporalNode<Data, T> {
		const node = new TemporalNode(interval, data)
		this.root = this._insert(this.root, node)
		this._size++
		return node
	}

	delete(interval: IntervalLike<T>): boolean {
		const target = Interval.from(interval)
		const node = this.get(target)
		if (!node) {
			return false
		}
		this.root = this._removeNode(this.root, node)
		this._size--
		return true
	}

	/**
	 * Traverses the tree and collects results based on a predicate and mapper
	 * @param predicate Function that tests each node for inclusion
	 * @param mapper Function that transforms matching nodes into the desired output type
	 * @param options Traversal options including order
	 * @returns Array of transformed values from nodes that match the predicate
	 */
	select<Output = TemporalNode<Data, T>>(
		predicate: (node: TemporalNode<Data, T>) => boolean,
		mapper: (node: TemporalNode<Data, T>) => Output = (node) => node as Output,
		options: {
			order?: 'pre' | 'in' | 'post'
		} = {},
	): Output[] {
		const { order = 'in' } = options
		const results: Output[] = []

		const traverseNode = (node: TemporalNode<Data, T> | null) => {
			if (!node) return

			if (order === 'pre' && predicate(node)) {
				results.push(mapper(node))
			}

			traverseNode(node.left)

			if (order === 'in' && predicate(node)) {
				results.push(mapper(node))
			}

			traverseNode(node.right)

			if (order === 'post' && predicate(node)) {
				results.push(mapper(node))
			}
		}

		traverseNode(this.root)
		return results
	}

	private _insert(
		root: TemporalNode<Data, T> | null,
		node: TemporalNode<Data, T>,
	): TemporalNode<Data, T> {
		// Base case: if root is null, the new node becomes the root
		if (!root) {
			return node
		}

		const cmp = this._compareIntervals(node.interval, root.interval)
		if (cmp < 0) {
			root.left = this._insert(root.left, node)
		} else {
			root.right = this._insert(root.right, node)
		}

		return root.balance()
	}

	private _rebalance(node: TemporalNode<Data, T>): TemporalNode<Data, T> {
		if (!node) return node

		// If this is a leaf node, just update its height
		if (!node.left && !node.right) {
			node.updateHeight()
			return node
		}

		// Recursively balance children
		if (node.left) {
			node.left = this._rebalance(node.left)
		}
		if (node.right) {
			node.right = this._rebalance(node.right)
		}

		return node.balance()
	}

	private _removeNode(
		root: TemporalNode<Data, T> | null,
		target: TemporalNode<Data, T>,
	): TemporalNode<Data, T> | null {
		if (!root) {
			return null
		}

		const comparison = this._compareIntervals(target.interval, root.interval)

		if (comparison < 0) {
			root.left = this._removeNode(root.left, target)
		} else if (comparison > 0) {
			root.right = this._removeNode(root.right, target)
		} else {
			// Case 1: Leaf node
			if (!root.left && !root.right) {
				return null
			}

			// Case 2: Node with only one child
			if (!root.left) {
				return root.right
			}
			if (!root.right) {
				return root.left
			}

			// Case 3: Node with two children
			// Find the smallest value in the right subtree (successor)
			let successor = root.right
			while (successor.left) {
				successor = successor.left
			}

			// Copy successor's data and interval to this node
			root.data = successor.data
			root.interval = successor.interval

			// Remove the successor
			root.right = this._removeNode(root.right, successor)
		}

		return root.balance()
	}

	get size(): number {
		return this._size
	}
}
