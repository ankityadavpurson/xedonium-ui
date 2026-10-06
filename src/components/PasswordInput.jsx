import { forwardRef, useId, useState } from 'react'
import Label from './Label'
import EyeIcon from './icons/Eye'
import EyeOffIcon from './icons/EyeOff'
import inputClass from './inputClass'

/**
 * Labelled password input with a show / hide toggle. `onChange` receives the value string. `error` shows a message and
 * sets the invalid style; `autoComplete` defaults to "current-password" (use "new-password" for sign-up forms).
 */
const PasswordInput = forwardRef(
	(
		{
			label,
			value,
			onChange,
			error,
			placeholder,
			autoComplete = 'current-password',
			disabled = false,
			className = '',
			...rest
		},
		ref
	) => {
		const id = useId()
		const errorId = `${id}-error`
		const [visible, setVisible] = useState(false)

		return (
			<div className="flex flex-col gap-1">
				{label && <Label htmlFor={id}>{label}</Label>}
				<div className="relative">
					<input
						ref={ref}
						id={id}
						type={visible ? 'text' : 'password'}
						autoComplete={autoComplete}
						disabled={disabled}
						placeholder={placeholder}
						aria-invalid={!!error}
						aria-describedby={error ? errorId : undefined}
						className={`${inputClass(!!error)} pr-10 ${className}`}
						value={value}
						onChange={e => onChange?.(e.target.value)}
						{...rest}
					/>
					<button
						type="button"
						disabled={disabled}
						aria-label={visible ? 'Hide password' : 'Show password'}
						aria-pressed={visible}
						onClick={() => setVisible(v => !v)}
						className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-app-muted outline-none transition hover:text-app-text focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-app-strong disabled:cursor-not-allowed disabled:opacity-50"
					>
						{visible ? <EyeOffIcon /> : <EyeIcon />}
					</button>
				</div>
				{error && (
					<span id={errorId} className="text-xs text-red-700 dark:text-red-400">
						{error}
					</span>
				)}
			</div>
		)
	}
)
PasswordInput.displayName = 'PasswordInput'

export default PasswordInput
