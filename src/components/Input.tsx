import { forwardRef, useRef, type ComponentPropsWithoutRef, type KeyboardEvent, type ReactNode } from 'react'
import XIcon from './icons/X'
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
	/** Shows a clear button while there is a value (and the field is editable); Escape clears too. */
	clearable?: boolean
	/** Accessible name of the clear button (default "Clear"). */
	clearLabel?: string
}

/**
 * Bare text input (no label; use Field for a labelled one). `onChange` receives the value string.
 * `startAdornment` / `endAdornment` put an icon or button inside the field and pad the text to clear it.
 * `clearable` adds a clear button (and Escape) that calls `onChange('')` and returns focus to the input.
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
	(
		{
			value,
			onChange,
			invalid = false,
			type = 'text',
			className = '',
			startAdornment,
			endAdornment,
			clearable = false,
			clearLabel = 'Clear',
			onKeyDown,
			...rest
		},
		ref
	) => {
		const innerRef = useRef<HTMLInputElement | null>(null)
		const setRefs = (node: HTMLInputElement | null) => {
			innerRef.current = node
			if (typeof ref === 'function') ref(node)
			else if (ref) ref.current = node
		}
		const showClear = clearable && value !== undefined && String(value) !== '' && !rest.disabled && !rest.readOnly
		const clear = () => {
			onChange?.('')
			innerRef.current?.focus()
		}
		const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
			onKeyDown?.(e)
			if (e.key === 'Escape' && showClear && !e.defaultPrevented) {
				e.stopPropagation()
				clear()
			}
		}
		const hasEnd = showClear || !!endAdornment
		const padEnd = showClear && endAdornment ? 'pr-[4.5rem]' : hasEnd ? 'pr-9' : ''
		const input = (
			<input
				ref={setRefs}
				type={type}
				aria-invalid={invalid || undefined}
				className={`${inputClass(invalid)} ${startAdornment ? 'pl-9' : ''} ${padEnd} ${className}`}
				value={value}
				onChange={e => onChange?.(e.target.value)}
				onKeyDown={handleKeyDown}
				{...rest}
			/>
		)
		if (!startAdornment && !hasEnd) return input

		return (
			<div className="relative">
				{input}
				{startAdornment && (
					<span className="pointer-events-none absolute inset-y-0 left-0 flex w-9 items-center justify-center text-app-muted [&>svg]:h-4 [&>svg]:w-4">
						{startAdornment}
					</span>
				)}
				{hasEnd && (
					<span className="absolute inset-y-0 right-0 flex items-center text-app-muted">
						{showClear && (
							<button
								type="button"
								aria-label={clearLabel}
								onClick={clear}
								className="flex h-full w-9 shrink-0 items-center justify-center outline-none transition hover:text-app-text focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-app-strong"
							>
								<XIcon className="size-3.5" />
							</button>
						)}
						{endAdornment && (
							<span className="flex h-full w-9 items-center justify-center [&>svg]:h-4 [&>svg]:w-4">
								{endAdornment}
							</span>
						)}
					</span>
				)}
			</div>
		)
	}
)
Input.displayName = 'Input'

export default Input
