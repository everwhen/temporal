import type { Point } from '../point.ts'

export function min<T extends Point>(...values: T[]): T {
  let min = values[0] as T
  for (const value of values) {
    min = value.compare(min) < 0 ? value : min
  }

  return min
}
