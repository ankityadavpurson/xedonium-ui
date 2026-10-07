import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import Label from './Label'

export interface FieldProps extends Omit<ComponentPropsWithoutRef<'input'>, 'onChange' | 'value'> {
	label: ReactNode
	value?: string | number
	/** Receives the value string. */
	onChange: (value: string) => void
	error?: ReactNode
	/** Sets `aria-required` (default true). */
	required?: boolean
}

const Field = ({
	label,
	value,
	onChange,
	placeholder,
	error,
	type = 'text',
	autoComplete = 'off',
	required = true,
	...inputProps
}: FieldProps) => {
	const id = useId()
	const errorId = `${id}-error`

	return (
		<div className="flex flex-col gap-1">
			<Label htmlFor={id}>{label}</Label>
			<input
				id={id}
				type={type}
				autoComplete={autoComplete}
				aria-required={required}
				aria-invalid={!!error}
				aria-describedby={error ? errorId : undefined}
				className={`bg-app-bg border px-3 py-2 text-sm text-app-text placeholder:text-app-muted outline-none transition focus:ring-2 focus:ring-app-strong focus:border-app-strong ${
					error ? 'border-red-500' : 'border-app-border'
				}`}
				placeholder={placeholder}
				value={value}
				onChange={e => onChange(e.target.value)}
				{...inputProps}
			/>
			{error && (
				<span id={errorId} className="text-xs text-red-700 dark:text-red-400">
					{error}
				</span>
			)}
		</div>
	)
}

export default Field
