import { Interval, IntervalLike } from '../interval.js'
import { Point } from '../point.js'

export class TemporalNode<Data, T extends Point> {
	interval: Interval<T>
	left: TemporalNode<Data, T> | null
	right: TemporalNode<Data, T> | null
	height = 0
	data: Data

	constructor(interval: IntervalLike<T>, data: Data) {
		this.interval = Interval.from(interval)
		this.left = null
		this.right = null
		this.data = data
	}

	get balanceFactor(): number {
		const left = this.left?.height ?? 0
		const right = this.right?.height ?? 0
		return left - right
	}

	updateHeight() {
		const left = this.left?.height ?? 0
		const right = this.right?.height ?? 0
		this.height = Math.max(left, right) + 1
	}

	rotateRight(): TemporalNode<Data, T> {
		const newRoot = this.left!
		const transferredNode = newRoot.right

		newRoot.right = this
		this.left = transferredNode

		this.updateHeight()
		newRoot.updateHeight()

		return newRoot
	}

	rotateLeft(): TemporalNode<Data, T> {
		const newRoot = this.right!
		const transferredNode = newRoot.left

		newRoot.left = this
		this.right = transferredNode

		this.updateHeight()
		newRoot.updateHeight()

		return newRoot
	}

	balance(): TemporalNode<Data, T> {
		this.updateHeight()
		const bf = this.balanceFactor

		if (bf > 1) {
			if (this.left!.balanceFactor < 0) {
				this.left = this.left!.rotateLeft()
			}
			return this.rotateRight()
		}

		if (bf < -1) {
			if (this.right!.balanceFactor > 0) {
				this.right = this.right!.rotateRight()
			}
			return this.rotateLeft()
		}

		return this
	}
}
