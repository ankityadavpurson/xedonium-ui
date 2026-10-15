// Local-time date helpers shared by Calendar and the pickers. Dates are plain `Date` objects at local midnight.

export const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const addDays = (date: Date, days: number) =>
	new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)

// Clamps the day so Jan 31 + 1 month is Feb 28/29 rather than Mar 3
export const addMonths = (date: Date, months: number) => {
	const target = new Date(date.getFullYear(), date.getMonth() + months, 1)
	const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
	return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay))
}

export const isSameDay = (a?: Date | null, b?: Date | null) => !!a && !!b && a.getTime() === b.getTime()

export const isBefore = (a: Date, b: Date) => a.getTime() < b.getTime()

export const isOutOfRange = (date: Date, min?: Date | null, max?: Date | null) =>
	(!!min && isBefore(date, min)) || (!!max && isBefore(max, date))

// Whether any day of the month of `month` lies within min..max (both compared by day)
export const monthHasSelectableDay = (month: Date, min?: Date | null, max?: Date | null) => {
	const first = new Date(month.getFullYear(), month.getMonth(), 1)
	const last = new Date(month.getFullYear(), month.getMonth() + 1, 0)
	return !(min && isBefore(last, min)) && !(max && isBefore(max, first))
}

// The nearest day within min..max (the date itself when it is inside, or when the range is empty)
export const clampToRange = (date: Date, min?: Date | null, max?: Date | null) => {
	if (min && max && isBefore(max, min)) return date
	if (min && isBefore(date, min)) return min
	if (max && isBefore(max, date)) return max
	return date
}

// Weeks (arrays of 7 dates) covering the month of `viewDate`, padded with neighbouring-month days
export const monthGrid = (viewDate: Date, weekStartsOn = 0): Date[][] => {
	const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
	const offset = (first.getDay() - weekStartsOn + 7) % 7
	const start = addDays(first, -offset)
	const weeks: Date[][] = []
	for (let w = 0; w < 6; w++) {
		const week = Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d))
		if (w >= 4 && week[0].getMonth() !== viewDate.getMonth()) break
		weeks.push(week)
	}
	return weeks
}

export const weekdayLabels = (weekStartsOn = 0, locale?: string) =>
	Array.from({ length: 7 }, (_, i) => {
		const day = new Date(2023, 0, 1 + ((weekStartsOn + i) % 7)) // 2023-01-01 is a Sunday
		return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(day)
	})

export const formatMonth = (date: Date, locale?: string) =>
	new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date)

export const formatDate = (date?: Date | null, locale?: string) =>
	date ? new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(date) : ''
