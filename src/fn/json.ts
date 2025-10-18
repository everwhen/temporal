import * as devalue from 'devalue'
import { Instant } from '../instant.ts'
import {
  isInstant,
  isPlainDate,
  isPlainDateTime,
  isPlainTime,
  isPlainYearMonth,
  isZonedDateTime,
} from '../is.ts'
import { PlainDateTime } from '../plain-date-time.ts'
import { PlainDate } from '../plain-date.ts'
import { PlainTime } from '../plain-time.ts'
import { PlainYearMonth } from '../plain-year-month.ts'
import { ZonedDateTime } from '../zoned-date-time.ts'

export function stringify(
  value: any,
  reducers?: Record<string, (value: any) => any> | undefined,
): string {
  return devalue.stringify(value, {
    PlainDate: (val) => isPlainDate(val) && val.toJSON(),
    PlainDateTime: (val) => isPlainDateTime(val) && val.toJSON(),
    PlainTime: (val) => isPlainTime(val) && val.toJSON(),
    PlainYearMonth: (val) => isPlainYearMonth(val) && val.toJSON(),
    ZonedDateTime: (val) => isZonedDateTime(val) && val.toJSON(),
    Instant: (val) => isInstant(val) && val.toJSON(),
    ...reducers,
  })
}

export function parse(
  serialized: string,
  revivers?: Record<string, (value: any) => any> | undefined,
): unknown {
  return devalue.parse(serialized, {
    PlainDate: (v) => PlainDate.from(v),
    PlainDateTime: (v) => PlainDateTime.from(v),
    PlainTime: (v) => PlainTime.from(v),
    PlainYearMonth: (v) => PlainYearMonth.from(v),
    ZonedDateTime: (v) => ZonedDateTime.from(v),
    Instant: (v) => Instant.from(v),
    ...revivers,
  })
}

export const json = {
  stringify,
  parse,
}
