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

/**
 * Gets the parameters of a class method as an object type with parameter names
 * This is useful when you want named parameters rather than a tuple
 * @template T - The class type
 * @template K - The method key (keyof T)
 * @template Names - Optional tuple of parameter names
 */
export type MethodParametersAsObject<
	T,
	K extends keyof T,
	Names extends string[] = [],
> = T[K] extends (...args: infer P) => any
	? Names['length'] extends P['length']
		? {
				[I in keyof P & number as Names[I] extends string
					? Names[I]
					: `arg${I}`]: P[I]
		  }
		: { [I in keyof P & number as `arg${I}`]: P[I] }
	: never

/**
 * Gets the return type of a class method
 * @template T - The class type
 * @template K - The method key (keyof T)
 */
export type MethodReturnType<T, K extends keyof T> = T[K] extends (
	...args: any[]
) => infer R
	? R
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
