import {
  Interval,
  PlainDate,
  PlainDateTime,
  type PlainDateLike,
  type PlainTimeLike,
} from '../src/index.ts'

export function dateInterval(start: string, end: string): Interval<PlainDate> {
  return Interval.from({
    start: PlainDate.from(start),
    end: PlainDate.from(end),
  })
}

export function dateTimeInterval(
  start: string,
  end: string,
): Interval<PlainDateTime> {
  return Interval.from({
    start: PlainDateTime.from(start),
    end: PlainDateTime.from(end),
  })
}

export function pDateTime(
  timeLike: PlainTimeLike,
  dateLike: PlainDateLike = { year: 2025, month: 3, day: 1 },
): PlainDateTime {
  return PlainDateTime.from({ ...timeLike, ...dateLike })
}
