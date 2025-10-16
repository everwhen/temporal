import type { Point } from '../point.ts'

export function max<T extends Point>(...values: T[]): T {
  let max = values[0] as T
  for (const value of values) {
    max = value.compare(max) > 0 ? value : max
  }
  return max
}
