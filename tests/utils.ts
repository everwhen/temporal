import { Interval } from '../src/interval.js'
import { PlainDateTime } from '../src/plain-date-time.js'
import { PlainDate } from '../src/plain-date.js'
import type { Point } from '../src/point.js'
import {
	ZonedDateTime,
	type ZonedDateTimeLike,
} from '../src/zoned-date-time.js'

/** Test Util for creating PlainDate  */
export const pd = (year: number, month: number, day: number) => {
	return new PlainDate(year, month, day)
}

/** Test Util for creating PlainDateTime  */
export const pdt = (
	year: number,
	month: number,
	day: number,
	hour?: number,
	minute?: number,
	second?: number,
	millisecond?: number,
	microsecond?: number,
	nanosecond?: number,
) => {
	return PlainDateTime.from({
		year,
		month,
		day,
		hour,
		minute,
		second,
		millisecond,
		microsecond,
		nanosecond,
	})
}
/** Test Util for creating ZonedDateTime  */
export const zdt = (item: ZonedDateTimeLike) => {
	return ZonedDateTime.from(item)
}

/** Test Util for creating Interval  */
export const interval = (start: Point, end: Point) => {
	return Interval.from({ start, end })
}
