import { useEffect, useId, useRef } from 'react'

/** Checkbox with inline label. `onChange` receives the new boolean. `indeterminate` shows the mixed state. */
const Checkbox = ({ label, checked, onChange, indeterminate = false, disabled = false, className = '', ...rest }) => {
	const id = useId()
	const ref = useRef(null)
	useEffect(() => {
		if (ref.current) ref.current.indeterminate = indeterminate
	}, [indeterminate])

	return (
		<label
			htmlFor={id}
			className={`inline-flex items-center gap-2 text-sm text-app-text ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
		>
			<input
				ref={ref}
				id={id}
				type="checkbox"
				checked={checked}
				disabled={disabled}
				onChange={e => onChange?.(e.target.checked)}
				className="h-4 w-4 cursor-[inherit] accent-[rgb(var(--color-app-strong))]"
				{...rest}
			/>
			{label}
		</label>
	)
}

export default Checkbox
