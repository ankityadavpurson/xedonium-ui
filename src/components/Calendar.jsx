import { useEffect, useRef, useState } from 'react'
import {
	addDays,
	addMonths,
	formatMonth,
	isBefore,
	isOutOfRange,
	isSameDay,
	monthGrid,
	startOfDay,
	weekdayLabels,
} from '../utils/date'

const navButton =
	'border border-app-border bg-app-bg px-2 py-1 text-xs font-semibold text-app-text transition hover:border-app-strong disabled:cursor-not-allowed disabled:opacity-50'

/**
 * Month calendar. `value` is a Date (or null); `onChange` receives the picked Date.
 * `rangeStart` / `rangeEnd` highlight a range (used by DateRangePicker). `min` / `max` disable days outside them.
 * Arrow keys move by day / week, PageUp / PageDown by month, Home / End to the start / end of the week.
 */
const Calendar = ({
	value,
	onChange,
	rangeStart,
	rangeEnd,
	min,
	max,
	weekStartsOn = 0,
	locale,
	className = '',
}) => {
	const today = startOfDay(new Date())
	const anchor = value ?? rangeStart ?? today
	const [focused, setFocused] = useState(startOfDay(anchor))
	const [view, setView] = useState(new Date(anchor.getFullYear(), anchor.getMonth(), 1))
	const gridRef = useRef(null)
	const shouldFocus = useRef(false)

	useEffect(() => {
		if (!shouldFocus.current) return
		shouldFocus.current = false
		gridRef.current?.querySelector('button[tabindex="0"]')?.focus()
	})

	const moveFocus = next => {
		shouldFocus.current = true
		setFocused(next)
		if (next.getMonth() !== view.getMonth() || next.getFullYear() !== view.getFullYear()) {
			setView(new Date(next.getFullYear(), next.getMonth(), 1))
		}
	}

	const handleKeyDown = event => {
		const offset = (focused.getDay() - weekStartsOn + 7) % 7
		const moves = {
			ArrowLeft: addDays(focused, -1),
			ArrowRight: addDays(focused, 1),
			ArrowUp: addDays(focused, -7),
			ArrowDown: addDays(focused, 7),
			PageUp: addMonths(focused, -1),
			PageDown: addMonths(focused, 1),
			Home: addDays(focused, -offset),
			End: addDays(focused, 6 - offset),
		}
		if (!moves[event.key]) return
		event.preventDefault()
		moveFocus(moves[event.key])
	}

	const shiftMonth = delta => {
		const nextView = addMonths(view, delta)
		setView(nextView)
		setFocused(new Date(nextView.getFullYear(), nextView.getMonth(), Math.min(focused.getDate(), 28)))
	}

	const [from, to] = rangeStart && rangeEnd && isBefore(rangeEnd, rangeStart) ? [rangeEnd, rangeStart] : [rangeStart, rangeEnd]
	const weeks = monthGrid(view, weekStartsOn)

	return (
		<div className={`inline-block border border-app-border bg-app-card p-3 text-app-text ${className}`}>
			<div className="mb-2 flex items-center justify-between gap-2">
				<button type="button" className={navButton} aria-label="Previous month" onClick={() => shiftMonth(-1)}>
					&lsaquo;
				</button>
				<div aria-live="polite" className="text-xs font-semibold uppercase tracking-widest">
					{formatMonth(view, locale)}
				</div>
				<button type="button" className={navButton} aria-label="Next month" onClick={() => shiftMonth(1)}>
					&rsaquo;
				</button>
			</div>
			<table ref={gridRef} role="grid" onKeyDown={handleKeyDown} className="border-collapse">
				<thead>
					<tr>
						{weekdayLabels(weekStartsOn, locale).map(label => (
							<th
								key={label}
								scope="col"
								className="h-8 w-9 text-[10px] font-semibold uppercase tracking-widest text-app-muted"
							>
								{label.slice(0, 2)}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{weeks.map(week => (
						<tr key={week[0].getTime()}>
							{week.map(day => {
								const selected = isSameDay(day, value) || isSameDay(day, from) || isSameDay(day, to)
								const inRange = from && to && !isBefore(day, from) && !isBefore(to, day)
								const outside = day.getMonth() !== view.getMonth()
								const disabled = isOutOfRange(day, min, max)
								let tone = 'text-app-text hover:bg-app-bg'
								if (selected) tone = 'bg-app-strong text-app-bg'
								else if (inRange) tone = 'bg-app-soft/20 text-app-text'
								else if (outside) tone = 'text-app-muted hover:bg-app-bg'
								return (
									<td key={day.getTime()} role="gridcell" aria-selected={selected} className="p-0">
										<button
											type="button"
											tabIndex={isSameDay(day, focused) ? 0 : -1}
											disabled={disabled}
											aria-label={day.toDateString()}
											aria-current={isSameDay(day, today) ? 'date' : undefined}
											onClick={() => {
												setFocused(day)
												onChange?.(day)
											}}
											className={`h-9 w-9 text-xs transition disabled:cursor-not-allowed disabled:opacity-30 ${tone} ${
												isSameDay(day, today) && !selected ? 'font-bold underline underline-offset-2' : ''
											}`}
										>
											{day.getDate()}
										</button>
									</td>
								)
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

export default Calendar
