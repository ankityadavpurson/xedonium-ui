import { forwardRef } from 'react'
import inputClass from './inputClass'

/** Bare text input (no label; use Field for a labelled one). `onChange` receives the value string. */
const Input = forwardRef(({ value, onChange, invalid = false, type = 'text', className = '', ...rest }, ref) => (
	<input
		ref={ref}
		type={type}
		aria-invalid={invalid || undefined}
		className={`${inputClass(invalid)} ${className}`}
		value={value}
		onChange={e => onChange?.(e.target.value)}
		{...rest}
	/>
))
Input.displayName = 'Input'

export default Input
