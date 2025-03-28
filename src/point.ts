import { PlainDateTime } from './plain-date-time.js'
import { PlainDate } from './plain-date.js'
import { PlainTime } from './plain-time.js'
import { PlainYearMonth } from './plain-year-month.js'
import { ZonedDateTime } from './zoned-date-time.js'

export type Point =
	| PlainDateTime
	| PlainDate
	| PlainYearMonth
	| ZonedDateTime
	| PlainTime

export type ComparablePoint<T extends Point> = T extends PlainDateTime
	? PlainDateTime | PlainDate
	: T extends PlainDate
		? PlainDate | PlainDateTime | ZonedDateTime
		: T extends PlainYearMonth
			? PlainYearMonth | PlainDate | PlainDateTime | ZonedDateTime
			: T extends ZonedDateTime
				? ZonedDateTime
				: T extends PlainTime
					? PlainTime | PlainDateTime | ZonedDateTime
					: never

/**
 * Type that checks if two Points can be compared with each other
 * According to the Temporal specification and implementation:
 * - PlainDateTime can be compared with PlainDate (converting DateTime to Date)
 * - PlainDate can be compared with PlainDateTime/ZonedDateTime (converting to PlainDate)
 * - PlainYearMonth can be compared with PlainDate/PlainDateTime/ZonedDateTime (converting to YearMonth)
 * - ZonedDateTime can only be directly compared with other ZonedDateTimes
 * - PlainTime can be compared with PlainDateTime/ZonedDateTime (extracting time component)
 */
export type ComparablePoints<T extends Point, O extends Point> =
	// PlainDateTime comparisons
	T extends PlainDateTime
		? O extends PlainDateTime | PlainDate
			? true
			: false
		: // PlainDate comparisons
			T extends PlainDate
			? O extends PlainDate | PlainDateTime | ZonedDateTime
				? true
				: false
			: // PlainYearMonth comparisons
				T extends PlainYearMonth
				? O extends PlainYearMonth | PlainDate | PlainDateTime | ZonedDateTime
					? true
					: false
				: // ZonedDateTime comparisons
					T extends ZonedDateTime
					? O extends ZonedDateTime
						? true
						: false
					: // PlainTime comparisons
						T extends PlainTime
						? O extends PlainTime | PlainDateTime | ZonedDateTime
							? true
							: false
						: false
