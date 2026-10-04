import { useId } from 'react'
import inputClass from './inputClass'

/** Labelled native select. options: [{ value, label, disabled? }]. `onChange` receives the value string. */
const Select = ({ label, value, onChange, options, placeholder, error, className = '', ...rest }) => {
	const id = useId()
	const errorId = `${id}-error`
	return (
		<div className="flex flex-col gap-1">
			{label && (
				<label htmlFor={id} className="text-xs font-semibold uppercase tracking-widest text-app-muted">
					{label}
				</label>
			)}
			<select
				id={id}
				aria-invalid={!!error}
				aria-describedby={error ? errorId : undefined}
				className={`${inputClass(!!error)} ${className}`}
				value={value}
				onChange={e => onChange?.(e.target.value)}
				{...rest}
			>
				{placeholder && (
					<option value="" disabled>
						{placeholder}
					</option>
				)}
				{options.map(option => (
					<option key={option.value} value={option.value} disabled={option.disabled}>
						{option.label}
					</option>
				))}
			</select>
			{error && (
				<span id={errorId} className="text-xs text-red-700 dark:text-red-400">
					{error}
				</span>
			)}
		</div>
	)
}

export default Select
