import { Temporal } from 'temporal-polyfill'

/**
 * Gets the parameter types of a class method as a tuple
 * @template T - The class type
 * @template K - The method key (keyof T)
 */
export type MethodParameters<T, K extends keyof T> = T[K] extends (
  ...args: infer P
) => any
  ? P
  : never

export type TypeGuard<T> = (value: unknown) => value is T
/** Helper to extract the type from a type guard */
export type TypeGuardType<T> = T extends (value: unknown) => value is infer U
  ? U
  : never

type Constructor<T, Arguments extends unknown[] = any[]> = new (
  ...arguments_: Arguments
) => T
export type Class<T, Arguments extends unknown[] = any[]> = Constructor<
  T,
  Arguments
> & { prototype: T }

export type DateTimeUnit = Temporal.DateTimeUnit
export type TimeUnit = Temporal.TimeUnit
export type DateUnit = Temporal.DateUnit
export type RoundToOptions<T extends DateTimeUnit> = {
  smallestUnit: Temporal.SmallestUnit<T>
  roundingIncrement?: number
  roundingMode?: Temporal.RoundingMode
}
