import { useId, useRef, useState } from 'react'
import useDismissable from '../hooks/useDismissable'
import { formatDate, isBefore } from '../utils/date'
import Calendar from './Calendar'
import inputClass from './inputClass'

/**
 * Labelled date range field. `value` is `{ start, end }` (Dates or null); `onChange` receives the same shape.
 * Click once for the start, again for the end (picked in either order); the panel closes when the range is complete.
 */
const DateRangePicker = ({ label, value, onChange, min, max, placeholder = 'Select range', error, locale, weekStartsOn }) => {
	const [open, setOpen] = useState(false)
	// Pending start while the user is choosing the end date
	const [pending, setPending] = useState(null)
	const rootRef = useRef(null)
	const id = useId()
	const errorId = `${id}-error`

	const close = () => {
		setOpen(false)
		setPending(null)
	}
	useDismissable(open, rootRef, reason => {
		close()
		if (reason === 'escape') rootRef.current?.querySelector('button')?.focus()
	})

	const pick = date => {
		if (!pending) {
			setPending(date)
			onChange?.({ start: date, end: null })
			return
		}
		const [start, end] = isBefore(date, pending) ? [date, pending] : [pending, date]
		onChange?.({ start, end })
		close()
		rootRef.current?.querySelector('button')?.focus()
	}

	const text = value?.start ? `${formatDate(value.start, locale)} – ${value.end ? formatDate(value.end, locale) : '…'}` : ''

	return (
		<div ref={rootRef} className="relative flex flex-col gap-1">
			{label && (
				<label htmlFor={id} className="text-xs font-semibold uppercase tracking-widest text-app-muted">
					{label}
				</label>
			)}
			<button
				id={id}
				type="button"
				aria-haspopup="dialog"
				aria-expanded={open}
				aria-invalid={!!error}
				aria-describedby={error ? errorId : undefined}
				onClick={() => (open ? close() : setOpen(true))}
				className={`${inputClass(!!error)} text-left ${text ? '' : 'text-app-muted'}`}
			>
				{text || placeholder}
			</button>
			{open && (
				<div role="dialog" aria-label="Choose date range" className="absolute left-0 top-full z-[var(--xd-z-tooltip,70)] mt-1 shadow-xl">
					<Calendar
						rangeStart={pending ?? value?.start}
						rangeEnd={pending ? null : value?.end}
						min={min}
						max={max}
						locale={locale}
						weekStartsOn={weekStartsOn}
						onChange={pick}
					/>
				</div>
			)}
			{error && (
				<span id={errorId} className="text-xs text-red-700 dark:text-red-400">
					{error}
				</span>
			)}
		</div>
	)
}

export default DateRangePicker
