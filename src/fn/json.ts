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

/**
 * Serializes a value containing temporal types to a JSON string.
 *
 * Uses `devalue` for serialization, automatically handling all temporal types:
 * `PlainDate`, `PlainDateTime`, `PlainTime`, `PlainYearMonth`, `ZonedDateTime`, and `Instant`.
 *
 * @param value - The value to serialize (can contain temporal types at any depth)
 * @param reducers - Optional additional reducers for custom types
 * @returns A JSON string that can be parsed back with `parse()`
 *
 * @example
 * ```ts
 * import { PlainDate } from '@everwhen/temporal'
 * import { json } from '@everwhen/temporal/fn'
 *
 * const data = {
 *   event: 'Birthday',
 *   date: PlainDate.from('2024-06-15'),
 * }
 *
 * const serialized = json.stringify(data)
 * // Preserves the PlainDate type information
 * ```
 *
 * @example
 * ```ts
 * import { PlainDateTime, ZonedDateTime } from '@everwhen/temporal'
 * import { json } from '@everwhen/temporal/fn'
 *
 * // Works with nested structures and arrays
 * const schedule = {
 *   meetings: [
 *     { time: PlainDateTime.from('2024-06-15T09:00'), title: 'Standup' },
 *     { time: PlainDateTime.from('2024-06-15T14:00'), title: 'Review' },
 *   ],
 * }
 *
 * const serialized = json.stringify(schedule)
 * ```
 */
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

/**
 * Parses a JSON string serialized with `stringify()`, restoring temporal types.
 *
 * Uses `devalue` for parsing, automatically restoring all temporal types:
 * `PlainDate`, `PlainDateTime`, `PlainTime`, `PlainYearMonth`, `ZonedDateTime`, and `Instant`.
 *
 * @param serialized - The JSON string to parse (created by `stringify()`)
 * @param revivers - Optional additional revivers for custom types
 * @returns The parsed value with temporal types restored
 *
 * @example
 * ```ts
 * import { PlainDate } from '@everwhen/temporal'
 * import { json } from '@everwhen/temporal/fn'
 *
 * const data = {
 *   event: 'Birthday',
 *   date: PlainDate.from('2024-06-15'),
 * }
 *
 * const serialized = json.stringify(data)
 * const restored = json.parse(serialized) as typeof data
 *
 * restored.date instanceof PlainDate // true
 * restored.date.month // 6
 * ```
 *
 * @example
 * ```ts
 * import { json } from '@everwhen/temporal/fn'
 *
 * // Round-trip serialization preserves types
 * const original = { times: [PlainTime.from('09:00'), PlainTime.from('17:00')] }
 * const restored = json.parse(json.stringify(original))
 *
 * restored.times[0].hour // 9
 * ```
 */
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

/**
 * JSON serialization utilities for temporal types.
 *
 * Provides `stringify` and `parse` methods that automatically handle
 * serialization and deserialization of temporal types using `devalue`.
 *
 * @example
 * ```ts
 * import { PlainDate, PlainDateTime } from '@everwhen/temporal'
 * import { json } from '@everwhen/temporal/fn'
 *
 * const event = {
 *   name: 'Conference',
 *   date: PlainDate.from('2024-06-15'),
 *   startTime: PlainDateTime.from('2024-06-15T09:00'),
 * }
 *
 * // Serialize to JSON string
 * const serialized = json.stringify(event)
 *
 * // Parse back to objects with temporal types restored
 * const restored = json.parse(serialized)
 * ```
 */
export const json = {
  stringify,
  parse,
}
