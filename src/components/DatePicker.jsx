import { useId, useRef, useState } from 'react'
import useDismissable from '../hooks/useDismissable'
import { formatDate } from '../utils/date'
import Calendar from './Calendar'
import inputClass from './inputClass'

/** Labelled date field that opens a Calendar. `value` is a Date or null; `onChange` receives the picked Date. */
const DatePicker = ({ label, value, onChange, min, max, placeholder = 'Select date', error, locale, weekStartsOn }) => {
	const [open, setOpen] = useState(false)
	const rootRef = useRef(null)
	const id = useId()
	const errorId = `${id}-error`

	useDismissable(open, rootRef, reason => {
		setOpen(false)
		if (reason === 'escape') rootRef.current?.querySelector('button')?.focus()
	})

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
				onClick={() => setOpen(o => !o)}
				className={`${inputClass(!!error)} text-left ${value ? '' : 'text-app-muted'}`}
			>
				{value ? formatDate(value, locale) : placeholder}
			</button>
			{open && (
				<div role="dialog" aria-label="Choose date" className="absolute left-0 top-full z-[var(--xd-z-tooltip,70)] mt-1 shadow-xl">
					<Calendar
						value={value}
						min={min}
						max={max}
						locale={locale}
						weekStartsOn={weekStartsOn}
						onChange={date => {
							onChange?.(date)
							setOpen(false)
							rootRef.current?.querySelector('button')?.focus()
						}}
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

export default DatePicker
