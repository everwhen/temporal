import type { Point } from '../point.ts'

export function clamp<T extends Point>(value: T, min: T, max: T) {
  if (value.isBefore(min)) {
    return min
  }

  if (value.isAfter(max)) {
    return max
  }

  return value
}
