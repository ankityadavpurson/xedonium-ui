import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import inputClass from './inputClass'

export interface InputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'onChange' | 'value'> {
	value?: string | number
	/** Receives the value string, not the event. */
	onChange?: (value: string) => void
	invalid?: boolean
	/** Decorative content inside the start of the field, e.g. a search icon. Clicks pass through to the input. */
	startAdornment?: ReactNode
	/** Content inside the end of the field, e.g. a clear button. It can be interactive. */
	endAdornment?: ReactNode
}

/**
 * Bare text input (no label; use Field for a labelled one). `onChange` receives the value string.
 * `startAdornment` / `endAdornment` put an icon or button inside the field and pad the text to clear it.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
	({ value, onChange, invalid = false, type = 'text', className = '', startAdornment, endAdornment, ...rest }, ref) => {
		const input = (
			<input
				ref={ref}
				type={type}
				aria-invalid={invalid || undefined}
				className={`${inputClass(invalid)} ${startAdornment ? 'pl-9' : ''} ${endAdornment ? 'pr-9' : ''} ${className}`}
				value={value}
				onChange={e => onChange?.(e.target.value)}
				{...rest}
			/>
		)
		if (!startAdornment && !endAdornment) return input

		return (
			<div className="relative">
				{input}
				{startAdornment && (
					<span className="pointer-events-none absolute inset-y-0 left-0 flex w-9 items-center justify-center text-app-muted [&>svg]:h-4 [&>svg]:w-4">
						{startAdornment}
					</span>
				)}
				{endAdornment && (
					<span className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-app-muted [&>svg]:h-4 [&>svg]:w-4">
						{endAdornment}
					</span>
				)}
			</div>
		)
	}
)
Input.displayName = 'Input'

export default Input
