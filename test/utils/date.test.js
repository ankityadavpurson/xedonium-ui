import {
	addDays,
	addMonths,
	clampToRange,
	formatDate,
	formatMonth,
	isBefore,
	isOutOfRange,
	isSameDay,
	monthGrid,
	monthHasSelectableDay,
	startOfDay,
	weekdayLabels,
} from '../../src/utils/date'

describe('date utils', () => {
	it('startOfDay strips the time', () => {
		const d = startOfDay(new Date(2024, 4, 10, 15, 30))
		expect([d.getHours(), d.getMinutes(), d.getDate()]).toEqual([0, 0, 10])
	})

	it('addDays moves across month boundaries', () => {
		expect(addDays(new Date(2024, 0, 31), 1)).toEqual(new Date(2024, 1, 1))
		expect(addDays(new Date(2024, 0, 1), -1)).toEqual(new Date(2023, 11, 31))
	})

	it('addMonths clamps the day', () => {
		expect(addMonths(new Date(2024, 0, 31), 1)).toEqual(new Date(2024, 1, 29))
		expect(addMonths(new Date(2023, 0, 31), 1)).toEqual(new Date(2023, 1, 28))
		expect(addMonths(new Date(2024, 0, 15), -1)).toEqual(new Date(2023, 11, 15))
	})

	it('isSameDay / isBefore', () => {
		const a = new Date(2024, 1, 1)
		expect(isSameDay(a, new Date(2024, 1, 1))).toBe(true)
		expect(isSameDay(a, new Date(2024, 1, 2))).toBe(false)
		expect(isSameDay(null, a)).toBe(false)
		expect(isSameDay(a, undefined)).toBe(false)
		expect(isBefore(a, new Date(2024, 1, 2))).toBe(true)
		expect(isBefore(new Date(2024, 1, 2), a)).toBe(false)
	})

	it('isOutOfRange checks both bounds', () => {
		const min = new Date(2024, 1, 10)
		const max = new Date(2024, 1, 20)
		expect(isOutOfRange(new Date(2024, 1, 5), min, max)).toBe(true)
		expect(isOutOfRange(new Date(2024, 1, 25), min, max)).toBe(true)
		expect(isOutOfRange(new Date(2024, 1, 15), min, max)).toBe(false)
		expect(isOutOfRange(new Date(2024, 1, 15))).toBe(false)
	})

	it('monthGrid returns full weeks, trimming a trailing empty week', () => {
		// Feb 2026 starts on Sunday and has exactly 28 days -> 4 weeks
		const feb = monthGrid(new Date(2026, 1, 1))
		expect(feb).toHaveLength(4)
		expect(feb.every(w => w.length === 7)).toBe(true)
		const may = monthGrid(new Date(2024, 4, 1), 1)
		expect(may[0][0].getDay()).toBe(1)
		// Jun 2024 starts on Saturday and has 30 days -> 6 weeks
		expect(monthGrid(new Date(2024, 5, 1))).toHaveLength(6)
	})

	it('weekdayLabels respects the week start', () => {
		expect(weekdayLabels(0, 'en-US')[0]).toBe('Sun')
		expect(weekdayLabels(1, 'en-US')[0]).toBe('Mon')
		expect(weekdayLabels()).toHaveLength(7)
	})

	it('formats months and dates', () => {
		expect(formatMonth(new Date(2024, 4, 1), 'en-US')).toBe('May 2024')
		expect(formatDate(new Date(2024, 4, 3), 'en-US')).toBe('May 3, 2024')
		expect(formatDate(null)).toBe('')
	})
})

describe('month range helpers', () => {
	const min = new Date(2024, 4, 10)
	const max = new Date(2024, 6, 20)

	it('says whether a month has any day within min..max', () => {
		expect(monthHasSelectableDay(new Date(2024, 3, 1), min, max)).toBe(false)
		expect(monthHasSelectableDay(new Date(2024, 3, 30), min, max)).toBe(false)
		expect(monthHasSelectableDay(new Date(2024, 4, 1), min, max)).toBe(true)
		expect(monthHasSelectableDay(new Date(2024, 5, 15), min, max)).toBe(true)
		expect(monthHasSelectableDay(new Date(2024, 6, 1), min, max)).toBe(true)
		expect(monthHasSelectableDay(new Date(2024, 7, 1), min, max)).toBe(false)
		// the last day of min's month and the first day of max's month count
		expect(monthHasSelectableDay(new Date(2024, 4, 31), new Date(2024, 4, 31), null)).toBe(true)
		expect(monthHasSelectableDay(new Date(2024, 6, 1), null, new Date(2024, 6, 1))).toBe(true)
	})

	it('is open ended without min or max', () => {
		expect(monthHasSelectableDay(new Date(1990, 0, 1))).toBe(true)
		expect(monthHasSelectableDay(new Date(2100, 0, 1), min, null)).toBe(true)
		expect(monthHasSelectableDay(new Date(1990, 0, 1), null, max)).toBe(true)
	})

	it('clamps a date to the nearest allowed day', () => {
		expect(clampToRange(new Date(2024, 0, 1), min, max)).toBe(min)
		expect(clampToRange(new Date(2025, 0, 1), min, max)).toBe(max)
		const inside = new Date(2024, 5, 1)
		expect(clampToRange(inside, min, max)).toBe(inside)
		expect(clampToRange(inside)).toBe(inside)
		// an empty range (min after max) leaves the date alone
		expect(clampToRange(inside, max, min)).toBe(inside)
	})
})
