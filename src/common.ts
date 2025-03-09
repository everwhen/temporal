import { isObject, isString } from './is.js'
import type { PlainDateTime } from './plain-date-time.js'
import { PlainDate } from './plain-date.js'
import type { ZonedDateTime } from './zoned-date-time.js'

export type CalendaDateLike = PlainDate | PlainDateTime | ZonedDateTime

export function startOfWeek<T extends CalendaDateLike>(date: T): T {
	return date.subtract({
		days: (date.dayOfWeek + (date.daysInWeek - 1)) % date.daysInWeek,
	}) as T
}

export function endOfWeek<T extends CalendaDateLike>(date: T): T {
	return date.startOfWeek().add({ days: date.daysInWeek - 1 }) as T
}

export function toLocale(
	localesOrOptions?: string | string[] | Intl.DateTimeFormatOptions,
	options?: Intl.DateTimeFormatOptions,
): {
	locale: string | string[]
	options: Intl.DateTimeFormatOptions
} {
	let locale: string | string[] = new Intl.DateTimeFormat().resolvedOptions()
		.locale
	let opts = options
	if (isString(localesOrOptions) || Array.isArray(localesOrOptions)) {
		locale = localesOrOptions
	}

	if (isObject(localesOrOptions) && !Array.isArray(localesOrOptions)) {
		opts = localesOrOptions
	}
	return { locale, options: resolveDateTimeOptions(opts ?? {}) }
}

type DateTimeFormatOptions = Intl.DateTimeFormatOptions

const TIME_STYLE_MAPPINGS = {
	short: {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	},
	medium: {
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		hour12: true,
	},
	long: {
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		timeZoneName: 'short',
		hour12: true,
	},
	full: {
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric',
		timeZoneName: 'long',
		hour12: true,
	},
} as const

const DATE_STYLE_MAPPINGS = {
	short: {
		year: '2-digit',
		month: 'numeric',
		day: 'numeric',
	},
	medium: {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	},
	long: {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		weekday: 'long',
	},
	full: {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		weekday: 'long',
		era: 'long',
	},
} as const

/**
 * Resolves {@linkcode Intl.DateTimeFormatOptions} by expanding style shorthands
 * if any of the more granular options are present. Essentially treating granular properties
 * like `year`, `month`, `hour`, etc., as overrides for `dateStyle` and `timeStyle` settings.
 *
 * @example
 * Input: { dateStyle: 'medium', timeStyle: 'short', month: 'short' }
 * Output: { hour: 'numeric', minute: 'numeric', hour12: true, year: 'numeric', month: 'short', day: 'numeric' }
 */
export function resolveDateTimeOptions(
	options: DateTimeFormatOptions,
): DateTimeFormatOptions {
	// Create a copy without the style properties
	const { timeStyle, dateStyle, ...individualOptions } = { ...options }

	// If no style options present, return individual options as is
	if (!timeStyle && !dateStyle) {
		return individualOptions
	}

	const result: DateTimeFormatOptions = {}

	// Expand timeStyle if present
	if (timeStyle) {
		const timeMapping =
			TIME_STYLE_MAPPINGS[timeStyle as keyof typeof TIME_STYLE_MAPPINGS]
		Object.assign(result, timeMapping)
	}

	// Expand dateStyle if present
	if (dateStyle) {
		const dateMapping =
			DATE_STYLE_MAPPINGS[dateStyle as keyof typeof DATE_STYLE_MAPPINGS]
		Object.assign(result, dateMapping)
	}

	// Individual options override expanded style options
	return { ...result, ...individualOptions }
}
