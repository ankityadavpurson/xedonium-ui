import { useId } from 'react'
import inputClass from './inputClass'

/** Labelled time field using the native time control. `value` / `onChange` use "HH:MM" strings. `step` is in seconds. */
const TimePicker = ({ label, value, onChange, step = 900, min, max, error, ...rest }) => {
	const id = useId()
	const errorId = `${id}-error`
	return (
		<div className="flex flex-col gap-1">
			{label && (
				<label htmlFor={id} className="text-xs font-semibold uppercase tracking-widest text-app-muted">
					{label}
				</label>
			)}
			<input
				id={id}
				type="time"
				step={step}
				min={min}
				max={max}
				value={value}
				aria-invalid={!!error}
				aria-describedby={error ? errorId : undefined}
				onChange={e => onChange?.(e.target.value)}
				className={inputClass(!!error)}
				{...rest}
			/>
			{error && (
				<span id={errorId} className="text-xs text-red-700 dark:text-red-400">
					{error}
				</span>
			)}
		</div>
	)
}

export default TimePicker
