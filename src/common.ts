type DateTimeFormatOptions = Intl.DateTimeFormatOptions

export const TIME_STYLE_MAPPINGS = {
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

export const DATE_STYLE_MAPPINGS = {
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
