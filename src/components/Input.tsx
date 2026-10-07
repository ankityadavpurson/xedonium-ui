import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import inputClass from './inputClass'

export interface InputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'onChange' | 'value'> {
	value?: string | number
	/** Receives the value string, not the event. */
	onChange?: (value: string) => void
	invalid?: boolean
}

/** Bare text input (no label; use Field for a labelled one). `onChange` receives the value string. */
const Input = forwardRef<HTMLInputElement, InputProps>(
	({ value, onChange, invalid = false, type = 'text', className = '', ...rest }, ref) => (
		<input
			ref={ref}
			type={type}
			aria-invalid={invalid || undefined}
			className={`${inputClass(invalid)} ${className}`}
			value={value}
			onChange={e => onChange?.(e.target.value)}
			{...rest}
		/>
	)
)
Input.displayName = 'Input'

export default Input
