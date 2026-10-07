import { useEffect, useId, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'onChange' | 'checked' | 'type'> {
	label?: ReactNode
	checked?: boolean
	/** Receives the new boolean. */
	onChange?: (checked: boolean) => void
	/** Shows the mixed state. */
	indeterminate?: boolean
}

/**
 * Square checkbox with inline label. `onChange` receives the new boolean. `indeterminate` shows the mixed state.
 * The native input stays in the DOM (visually hidden) so forms, labels and keyboard behave normally.
 */
const Checkbox = ({
	label,
	checked,
	onChange,
	indeterminate = false,
	disabled = false,
	className = '',
	...rest
}: CheckboxProps) => {
	const id = useId()
	const ref = useRef<HTMLInputElement>(null)
	useEffect(() => {
		if (ref.current) ref.current.indeterminate = indeterminate
	}, [indeterminate])

	const filled = checked || indeterminate

	return (
		<label
			htmlFor={id}
			className={`inline-flex min-h-8 items-center gap-2 align-middle text-sm leading-none text-app-text ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
		>
			<input
				ref={ref}
				id={id}
				type="checkbox"
				checked={checked}
				disabled={disabled}
				onChange={e => onChange?.(e.target.checked)}
				className="peer sr-only"
				{...rest}
			/>
			<span
				aria-hidden="true"
				className={`flex h-4 w-4 shrink-0 items-center justify-center border transition peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-app-strong ${
					filled ? 'border-app-strong bg-app-strong text-app-bg' : 'border-app-border bg-app-bg'
				}`}
			>
				{indeterminate ? (
					<svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.2">
						<path d="M3.5 8h9" />
					</svg>
				) : (
					checked && (
						<svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.2">
							<path strokeLinecap="square" strokeLinejoin="miter" d="M3 8.5l3.2 3.2L13 4.8" />
						</svg>
					)
				)}
			</span>
			{label}
		</label>
	)
}

export default Checkbox
