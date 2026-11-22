import { formatAbsolute, formatRelative } from '../../src/utils/relativeTime'

const NOW = Date.parse('2026-11-22T12:00:00Z')
const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const at = offset => NOW + offset
const rel = (offset, locale) => formatRelative(at(offset), NOW, locale)

describe('formatRelative', () => {
	it('defaults to English', () => {
		expect(rel(-3 * MINUTE)).toBe('3 minutes ago')
	})

	it('says "now" for the same moment and within half a second', () => {
		expect(rel(0)).toBe('now')
		expect(rel(-499)).toBe('now')
		expect(rel(499)).toBe('now')
		expect(rel(-501)).toBe('1 second ago')
	})

	it('reads up to a minute in the future as "now" (clock skew)', () => {
		expect(rel(14 * SECOND)).toBe('now')
		expect(rel(60 * SECOND)).toBe('now')
		expect(rel(61 * SECOND)).toBe('in 1 minute')
	})

	it('counts seconds in the past', () => {
		expect(rel(-14 * SECOND)).toBe('14 seconds ago')
		expect(rel(-59 * SECOND)).toBe('59 seconds ago')
	})

	it('rounds to the nearest unit', () => {
		expect(rel(-(2 * MINUTE + 29 * SECOND))).toBe('2 minutes ago')
		expect(rel(-(2 * MINUTE + 50 * SECOND))).toBe('3 minutes ago')
		expect(rel(-(5 * HOUR + 20 * MINUTE))).toBe('5 hours ago')
		expect(rel(5 * HOUR)).toBe('in 5 hours')
		// an event created exactly 3 days ahead, a moment later
		expect(rel(3 * DAY - 5 * SECOND)).toBe('in 3 days')
	})

	it('moves to the next unit when a value rounds up to it', () => {
		expect(rel(-59.4 * SECOND)).toBe('59 seconds ago')
		expect(rel(-59.6 * SECOND)).toBe('1 minute ago')
		expect(rel(-(HOUR - 20 * SECOND))).toBe('1 hour ago')
		expect(rel(-23 * HOUR)).toBe('23 hours ago')
		expect(rel(-(DAY - 20 * MINUTE))).toBe('yesterday')
	})

	it('uses words for days', () => {
		expect(rel(-DAY)).toBe('yesterday')
		expect(rel(-1.4 * DAY)).toBe('yesterday')
		expect(rel(-1.6 * DAY)).toBe('2 days ago')
		expect(rel(DAY)).toBe('tomorrow')
		expect(rel(3 * DAY)).toBe('in 3 days')
		expect(rel(-29 * DAY)).toBe('29 days ago')
	})

	it('always uses numbers for months and years', () => {
		expect(rel(-30 * DAY)).toBe('1 month ago')
		expect(rel(45 * DAY)).toBe('in 1 month')
		expect(rel(-330 * DAY)).toBe('11 months ago')
	})

	it('rolls 12 months over to years', () => {
		expect(rel(-350 * DAY)).toBe('11 months ago') // 11.5 months
		expect(rel(-360 * DAY)).toBe('1 year ago') // 11.8 months rounds to 12
		expect(rel(-366 * DAY)).toBe('1 year ago')
		expect(rel(400 * DAY)).toBe('in 1 year')
		expect(rel(-800 * DAY)).toBe('2 years ago')
	})

	it('takes a Date, a timestamp or an ISO string', () => {
		const iso = new Date(at(-2 * HOUR)).toISOString()
		expect(formatRelative(iso, NOW)).toBe('2 hours ago')
		expect(formatRelative(new Date(at(-2 * HOUR)), new Date(NOW))).toBe('2 hours ago')
		expect(formatRelative(at(-2 * HOUR), new Date(NOW).toISOString())).toBe('2 hours ago')
	})

	it('measures from the current time by default', () => {
		expect(formatRelative(Date.now() - 5 * MINUTE)).toBe('5 minutes ago')
	})

	it('formats in the given locale', () => {
		expect(rel(-DAY, 'fr')).toBe('hier')
		// numeric: 'auto' uses the locale's own words where it has them ("the day before yesterday")
		expect(rel(-2 * DAY, 'de')).toBe('vorgestern')
		expect(rel(-3 * DAY, 'de')).toBe('vor 3 Tagen')
		expect(rel(30 * DAY, 'es')).toBe('dentro de 1 mes')
	})

	it('returns an empty string for an invalid date', () => {
		expect(formatRelative('not a date', NOW)).toBe('')
		expect(formatRelative(NOW, 'nope')).toBe('')
	})
})

describe('formatAbsolute', () => {
	it('shows the date and the time to the second, with the time zone', () => {
		expect(formatAbsolute('2026-11-22T10:15:30Z', 'en', 'UTC')).toMatch(/^Nov 22, 2026, 10:15:30\sAM UTC$/)
	})

	it('formats in the given locale', () => {
		expect(formatAbsolute('2026-11-22T10:15:30Z', 'de', 'UTC')).toMatch(/^22\.11\.2026, 10:15:30 UTC$/)
	})

	it('uses the device time zone by default', () => {
		const expected = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'long' }).format(new Date(NOW))
		expect(formatAbsolute(NOW)).toBe(expected)
	})

	it('returns an empty string for an invalid date', () => {
		expect(formatAbsolute('not a date')).toBe('')
	})
})
