// Local-time date helpers shared by Calendar and the pickers. Dates are plain `Date` objects at local midnight.

export const startOfDay = date => new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)

// Clamps the day so Jan 31 + 1 month is Feb 28/29 rather than Mar 3
export const addMonths = (date, months) => {
	const target = new Date(date.getFullYear(), date.getMonth() + months, 1)
	const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
	return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay))
}

export const isSameDay = (a, b) => !!a && !!b && a.getTime() === b.getTime()

export const isBefore = (a, b) => a.getTime() < b.getTime()

export const isOutOfRange = (date, min, max) => (!!min && isBefore(date, min)) || (!!max && isBefore(max, date))

// Weeks (arrays of 7 dates) covering the month of `viewDate`, padded with neighbouring-month days
export const monthGrid = (viewDate, weekStartsOn = 0) => {
	const first = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1)
	const offset = (first.getDay() - weekStartsOn + 7) % 7
	const start = addDays(first, -offset)
	const weeks = []
	for (let w = 0; w < 6; w++) {
		const week = Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d))
		if (w >= 4 && week[0].getMonth() !== viewDate.getMonth()) break
		weeks.push(week)
	}
	return weeks
}

export const weekdayLabels = (weekStartsOn = 0, locale) =>
	Array.from({ length: 7 }, (_, i) => {
		const day = new Date(2023, 0, 1 + ((weekStartsOn + i) % 7)) // 2023-01-01 is a Sunday
		return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(day)
	})

export const formatMonth = (date, locale) => new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(date)

export const formatDate = (date, locale) =>
	date ? new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(date) : ''
