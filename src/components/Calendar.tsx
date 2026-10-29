import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import ChevronDownIcon from './icons/ChevronDown'
import ChevronLeftIcon from './icons/ChevronLeft'
import ChevronRightIcon from './icons/ChevronRight'
import ChevronUpIcon from './icons/ChevronUp'
import {
	addDays,
	addMonths,
	clampToRange,
	formatMonth,
	isBefore,
	isOutOfRange,
	monthHasSelectableDay,
	isSameDay,
	monthGrid,
	startOfDay,
	weekdayLabels,
} from '../utils/date'

export interface CalendarProps {
	value?: Date | null
	/** Receives the picked Date. */
	onChange?: (date: Date) => void
	/** Highlight a range (used by DateRangePicker). */
	rangeStart?: Date | null
	rangeEnd?: Date | null
	/** Days outside `min`..`max` are disabled, and so is paging to months with no allowed day. */
	min?: Date | null
	max?: Date | null
	/** 0 = Sunday (default). */
	weekStartsOn?: number
	locale?: string
	/**
	 * How to jump to another month / year: 'dropdown' opens a month and year picker from the title,
	 * 'input' lets the title open a DD / MM / YYYY entry, 'none' (default) keeps a plain title.
	 */
	jumpMode?: 'none' | 'dropdown' | 'input'
	className?: string
}

const navButton =
	'min-h-8 min-w-8 border border-app-border bg-app-bg px-2 py-1 text-xs font-semibold text-app-text transition hover:border-app-strong disabled:cursor-not-allowed disabled:opacity-50'

const pickCell =
	'h-9 text-xs font-semibold uppercase tracking-widest transition disabled:cursor-not-allowed disabled:opacity-30'

const fieldClass =
	'min-h-8 rounded-none border border-app-border bg-app-card px-2 py-1 text-xs text-app-text focus:border-app-strong focus:outline-none'

/**
 * Month calendar. Set `jumpMode` to jump months with dropdowns or by typing a date. `value` is a Date (or null); `onChange` receives the picked Date.
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
	jumpMode = 'none',
	className = '',
}: CalendarProps) => {
	const today = startOfDay(new Date())
	// min / max limit whole days: a time on them does not disable their own day
	const lo = min ? startOfDay(min) : null
	const hi = max ? startOfDay(max) : null
	// With nothing selected, open on today, or on the nearest allowed day when today is outside the range
	const anchor = value ?? rangeStart ?? clampToRange(today, lo, hi)
	const [focused, setFocused] = useState(startOfDay(anchor))
	const [view, setView] = useState(new Date(anchor.getFullYear(), anchor.getMonth(), 1))
	const [pickerOpen, setPickerOpen] = useState(false)
	const [typed, setTyped] = useState({ day: '', month: '', year: '' })
	const [typedError, setTypedError] = useState('')
	const [pickerView, setPickerView] = useState<'months' | 'years'>('months')
	const [browseYear, setBrowseYear] = useState(view.getFullYear())
	const rootRef = useRef<HTMLDivElement>(null)
	const gridRef = useRef<HTMLTableElement>(null)
	const shouldFocus = useRef(false)

	useEffect(() => {
		if (!shouldFocus.current) return
		shouldFocus.current = false
		gridRef.current?.querySelector<HTMLButtonElement>('button[tabindex="0"]')?.focus()
	})

	useEffect(() => {
		if (!pickerOpen || jumpMode !== 'dropdown') return
		const close = (event: MouseEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) setPickerOpen(false)
		}
		document.addEventListener('mousedown', close)
		return () => document.removeEventListener('mousedown', close)
	}, [pickerOpen, jumpMode])

	const moveFocus = (next: Date) => {
		shouldFocus.current = true
		setFocused(next)
		if (next.getMonth() !== view.getMonth() || next.getFullYear() !== view.getFullYear()) {
			setView(new Date(next.getFullYear(), next.getMonth(), 1))
		}
	}

	const handleKeyDown = (event: KeyboardEvent) => {
		const offset = (focused.getDay() - weekStartsOn + 7) % 7
		const moves: Record<string, Date> = {
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
		// never into a day (or a month) outside min..max
		moveFocus(clampToRange(moves[event.key], lo, hi))
	}

	const prevMonth = addMonths(view, -1)
	const nextMonth = addMonths(view, 1)
	const canGoBack = monthHasSelectableDay(prevMonth, lo, hi)
	const canGoForward = monthHasSelectableDay(nextMonth, lo, hi)

	const shiftMonth = (delta: number) => {
		if (!(delta < 0 ? canGoBack : canGoForward)) return
		const nextView = addMonths(view, delta)
		setView(nextView)
		setFocused(
			clampToRange(new Date(nextView.getFullYear(), nextView.getMonth(), Math.min(focused.getDate(), 28)), lo, hi)
		)
	}

	const jumpTo = (month: number, year: number) => {
		const nextView = new Date(year, month, 1)
		if (!monthHasSelectableDay(nextView, lo, hi)) return
		setView(nextView)
		setFocused(clampToRange(new Date(year, month, Math.min(focused.getDate(), 28)), lo, hi))
	}

	const submitTyped = () => {
		const d = Number(typed.day)
		const m = Number(typed.month)
		const y = Number(typed.year)
		const date = new Date(y, m - 1, d)
		date.setFullYear(y) // years 0-99 would otherwise map to 1900-1999
		const valid =
			typed.day !== '' &&
			typed.month !== '' &&
			typed.year.length === 4 &&
			date.getFullYear() === y &&
			date.getMonth() === m - 1 &&
			date.getDate() === d
		if (!valid) return setTypedError('Enter a valid date as DD / MM / YYYY')
		if (isOutOfRange(date, lo, hi)) return setTypedError('That date is not available')
		setTypedError('')
		setFocused(date)
		setView(new Date(y, m - 1, 1))
		setPickerOpen(false)
		onChange?.(date)
	}

	const togglePicker = () => {
		if (!pickerOpen) {
			setPickerView('months')
			setBrowseYear(view.getFullYear())
			setTyped({
				day: value ? String(value.getDate()) : '',
				month: value ? String(value.getMonth() + 1) : '',
				year: value ? String(value.getFullYear()) : '',
			})
			setTypedError('')
		}
		setPickerOpen(open => !open)
	}

	const monthNames = Array.from({ length: 12 }, (_, i) =>
		new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2000, i, 1))
	)
	const yearPageStart = Math.floor(browseYear / 12) * 12
	const yearAllowed = (year: number) => (!lo || year >= lo.getFullYear()) && (!hi || year <= hi.getFullYear())

	const [from, to] =
		rangeStart && rangeEnd && isBefore(rangeEnd, rangeStart) ? [rangeEnd, rangeStart] : [rangeStart, rangeEnd]
	const weeks = monthGrid(view, weekStartsOn)

	return (
		<div
			ref={rootRef}
			className={`relative inline-block border border-app-border bg-app-card p-3 text-app-text ${className}`}
		>
			<div className="mb-2 flex items-center justify-between gap-2">
				<button
					type="button"
					className={navButton}
					aria-label="Previous month"
					disabled={!canGoBack}
					onClick={() => shiftMonth(-1)}
				>
					<ChevronLeftIcon className="h-4 w-4" />
				</button>
				{jumpMode === 'none' ? (
					<div aria-live="polite" className="text-xs font-semibold uppercase tracking-widest">
						{formatMonth(view, locale)}
					</div>
				) : (
					<button
						type="button"
						aria-expanded={pickerOpen}
						aria-label={`${formatMonth(view, locale)}, ${jumpMode === 'input' ? 'enter a date' : 'choose month and year'}`}
						onClick={togglePicker}
						className="px-2 py-1 text-xs font-semibold uppercase tracking-widest transition hover:bg-app-bg"
					>
						{formatMonth(view, locale)} <span aria-hidden="true">{pickerOpen ? '▴' : '▾'}</span>
					</button>
				)}
				<button
					type="button"
					className={navButton}
					aria-label="Next month"
					disabled={!canGoForward}
					onClick={() => shiftMonth(1)}
				>
					<ChevronRightIcon className="h-4 w-4" />
				</button>
			</div>
			{jumpMode === 'dropdown' && pickerOpen && (
				<div
					className="absolute inset-x-3 top-[3.25rem] z-10 border border-app-border bg-app-card p-2 shadow-none"
					onKeyDown={event => {
						if (event.key === 'Escape') {
							event.stopPropagation()
							setPickerOpen(false)
						}
					}}
				>
					<div className="mb-2 flex items-center justify-between gap-2">
						<button
							type="button"
							className={navButton}
							aria-label={pickerView === 'months' ? 'Previous year' : 'Previous years'}
							disabled={!yearAllowed(pickerView === 'months' ? browseYear - 1 : yearPageStart - 1)}
							onClick={() => setBrowseYear(browseYear - (pickerView === 'months' ? 1 : 12))}
						>
							<ChevronLeftIcon className="h-4 w-4" />
						</button>
						<button
							type="button"
							aria-label={pickerView === 'months' ? 'Choose year' : 'Choose month'}
							onClick={() => setPickerView(pickerView === 'months' ? 'years' : 'months')}
							className="flex items-center gap-1 border border-app-border px-2 py-1 text-xs font-semibold uppercase tracking-widest transition hover:border-app-strong"
						>
							{pickerView === 'months' ? browseYear : `${yearPageStart} – ${yearPageStart + 11}`}
							{pickerView === 'months' ? (
								<ChevronDownIcon className="h-3 w-3" />
							) : (
								<ChevronUpIcon className="h-3 w-3" />
							)}
						</button>
						<button
							type="button"
							className={navButton}
							aria-label={pickerView === 'months' ? 'Next year' : 'Next years'}
							disabled={!yearAllowed(pickerView === 'months' ? browseYear + 1 : yearPageStart + 12)}
							onClick={() => setBrowseYear(browseYear + (pickerView === 'months' ? 1 : 12))}
						>
							<ChevronRightIcon className="h-4 w-4" />
						</button>
					</div>
					<div className="grid grid-cols-3 gap-1">
						{pickerView === 'months'
							? monthNames.map((name, i) => {
									const current = i === view.getMonth() && browseYear === view.getFullYear()
									return (
										<button
											key={name}
											type="button"
											aria-pressed={current}
											disabled={!monthHasSelectableDay(new Date(browseYear, i, 1), lo, hi)}
											onClick={() => {
												jumpTo(i, browseYear)
												setPickerOpen(false)
											}}
											className={`${pickCell} ${current ? 'bg-app-strong text-app-bg' : 'text-app-text hover:bg-app-bg'}`}
										>
											{name.slice(0, 3)}
										</button>
									)
								})
							: Array.from({ length: 12 }, (_, i) => yearPageStart + i).map(year => (
									<button
										key={year}
										type="button"
										aria-pressed={year === view.getFullYear()}
										disabled={!yearAllowed(year)}
										onClick={() => {
											setBrowseYear(year)
											setPickerView('months')
										}}
										className={`${pickCell} ${year === view.getFullYear() ? 'bg-app-strong text-app-bg' : 'text-app-text hover:bg-app-bg'}`}
									>
										{year}
									</button>
								))}
					</div>
				</div>
			)}
			{jumpMode === 'input' && pickerOpen && (
				<div
					className="mb-2 flex flex-col gap-1"
					onKeyDown={event => {
						if (event.key === 'Escape') {
							event.stopPropagation()
							setPickerOpen(false)
						}
					}}
				>
					<form
						className="flex items-center gap-1"
						onSubmit={event => {
							event.preventDefault()
							submitTyped()
						}}
					>
						{(
							[
								['day', 'Day', 'DD', 2],
								['month', 'Month number', 'MM', 2],
								['year', 'Year number', 'YYYY', 4],
							] as const
						).map(([key, label, placeholder, length]) => (
							<input
								key={key}
								inputMode="numeric"
								autoComplete="off"
								aria-label={label}
								aria-invalid={!!typedError}
								placeholder={placeholder}
								maxLength={length}
								value={typed[key]}
								onChange={event => setTyped({ ...typed, [key]: event.target.value.replace(/\D/g, '') })}
								className={`${fieldClass} w-0 min-w-0 text-center ${key === 'year' ? 'flex-[1.6]' : 'flex-1'}`}
							/>
						))}
						<button type="submit" className={`${navButton} ml-auto`}>
							Go
						</button>
					</form>
					{typedError && (
						<div role="alert" className="text-[11px] text-app-muted">
							{typedError}
						</div>
					)}
				</div>
			)}
			<table ref={gridRef} role="grid" onKeyDown={handleKeyDown} className="border-collapse">
				<thead>
					<tr>
						{weekdayLabels(weekStartsOn, locale).map(label => (
							<th
								key={label}
								scope="col"
								className="h-8 w-7 text-[10px] min-[360px]:w-8 sm:w-9 font-semibold uppercase tracking-widest text-app-muted"
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
								const disabled = isOutOfRange(day, lo, hi)
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
											className={`h-8 w-7 text-xs transition min-[360px]:w-8 sm:h-9 sm:w-9 disabled:cursor-not-allowed disabled:opacity-30 ${tone} ${
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
