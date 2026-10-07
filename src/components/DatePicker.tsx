import { useId, useRef, useState, type ReactNode } from 'react'
import useDismissable from '../hooks/useDismissable'
import { formatDate } from '../utils/date'
import Calendar from './Calendar'
import FloatingPanel from './FloatingPanel'
import inputClass from './inputClass'
import Label from './Label'

export interface DatePickerProps {
	label?: ReactNode
	value?: Date | null
	/** Receives the picked Date. */
	onChange?: (date: Date) => void
	min?: Date | null
	max?: Date | null
	placeholder?: string
	error?: ReactNode
	locale?: string
	weekStartsOn?: number
}

/** Labelled date field that opens a Calendar. `value` is a Date or null; `onChange` receives the picked Date. */
const DatePicker = ({
	label,
	value,
	onChange,
	min,
	max,
	placeholder = 'Select date',
	error,
	locale,
	weekStartsOn,
}: DatePickerProps) => {
	const [open, setOpen] = useState(false)
	const rootRef = useRef<HTMLDivElement>(null)
	const buttonRef = useRef<HTMLButtonElement>(null)
	const panelRef = useRef<HTMLDivElement>(null)
	const id = useId()
	const errorId = `${id}-error`

	useDismissable(open, [rootRef, panelRef], reason => {
		setOpen(false)
		if (reason === 'escape') rootRef.current?.querySelector('button')?.focus()
	})

	return (
		<div ref={rootRef} className="relative flex flex-col gap-1">
			{label && <Label htmlFor={id}>{label}</Label>}
			<button
				ref={buttonRef}
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
			<FloatingPanel
				open={open}
				anchorRef={buttonRef}
				panelRef={panelRef}
				placement="bottom-start"
				role="dialog"
				aria-label="Choose date"
				className="shadow-xl"
			>
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
			</FloatingPanel>
			{error && (
				<span id={errorId} className="text-xs text-red-700 dark:text-red-400">
					{error}
				</span>
			)}
		</div>
	)
}

export default DatePicker
