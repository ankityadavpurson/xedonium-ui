// Relative ("3 minutes ago") and absolute date formatting for RelativeTime. Plain functions, so they also work outside
// React (a server, a CSV export, a notification).

/** A moment: a Date, a timestamp in milliseconds, or a string `Date` can parse (ISO 8601 is the safe choice). */
export type DateInput = Date | number | string

export const DEFAULT_LOCALE = 'en'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
// Average lengths, so "in 1 month" and "1 year ago" agree with the calendar to within a day
const MONTH = 30.4375 * DAY
const YEAR = 365.25 * DAY
// A server clock slightly ahead of the browser would otherwise show "in 14 seconds" for something that just happened
const SKEW = 60 * SECOND

export const toDate = (value: DateInput) => (value instanceof Date ? value : new Date(value))

// Intl formatters are slow to build: one per locale and option set, reused
const cache = new Map<string, Intl.RelativeTimeFormat | Intl.DateTimeFormat>()
const relativeFormat = (locale: string, numeric: 'auto' | 'always') => {
	const key = `r|${locale}|${numeric}`
	if (!cache.has(key)) cache.set(key, new Intl.RelativeTimeFormat(locale, { numeric }))
	return cache.get(key) as Intl.RelativeTimeFormat
}
const absoluteFormat = (locale: string, timeZone?: string) => {
	const key = `a|${locale}|${timeZone ?? ''}`
	if (!cache.has(key))
		cache.set(key, new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'long', timeZone }))
	return cache.get(key) as Intl.DateTimeFormat
}

/**
 * `date` relative to `now`, such as "3 minutes ago", "yesterday", "in 2 months" or "1 year ago".
 *
 * Units go from seconds to years, rounded to the nearest one (2 minutes 50 seconds is "3 minutes ago", and an event
 * created 3 days ahead reads "in 3 days" until it is 2.5 days away). A unit that rounds up to the next one moves to it:
 * 59 minutes 40 seconds is "1 hour ago", and 12 months is "1 year ago". Days and shorter units use words where the
 * locale has them ("yesterday", "tomorrow", "now"); months and years always use numbers ("in 1 month", not "next
 * month"), so a list reads in one style. Up to a minute in the future reads as "now". Returns an empty string for an
 * invalid date.
 */
export const formatRelative = (date: DateInput, now: DateInput = Date.now(), locale = DEFAULT_LOCALE): string => {
	const time = toDate(date).getTime()
	const diff = time - toDate(now).getTime()
	if (Number.isNaN(diff)) return ''
	const distance = Math.abs(diff)
	const sign = diff < 0 ? -1 : 1
	const words = relativeFormat(locale, 'auto')
	const numbers = relativeFormat(locale, 'always')

	if (diff > 0 && diff <= SKEW) return words.format(0, 'second')
	const seconds = Math.round(distance / SECOND)
	// `|| 0`: half a second either side of now is 0, never "-0"
	if (seconds < 60) return words.format(sign * seconds || 0, 'second')
	const minutes = Math.round(distance / MINUTE)
	if (minutes < 60) return words.format(sign * minutes, 'minute')
	const hours = Math.round(distance / HOUR)
	if (hours < 24) return words.format(sign * hours, 'hour')
	const days = Math.round(distance / DAY)
	if (days < 30) return words.format(sign * days, 'day')
	const months = Math.round(distance / MONTH)
	if (months < 12) return numbers.format(sign * months, 'month')
	return numbers.format(sign * Math.max(1, Math.round(distance / YEAR)), 'year')
}

/**
 * `date` as a full date and time, to the second and with the time zone, such as "Nov 22, 2026, 10:15:00 AM GMT+1".
 * `timeZone` defaults to the device's. Returns an empty string for an invalid date.
 */
export const formatAbsolute = (date: DateInput, locale = DEFAULT_LOCALE, timeZone?: string): string => {
	const time = toDate(date)
	return Number.isNaN(time.getTime()) ? '' : absoluteFormat(locale, timeZone).format(time)
}
