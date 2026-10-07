import { forwardRef, useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import HelperText from './HelperText'
import Label from './Label'
import inputClass from './inputClass'

export interface TextAreaProps extends Omit<ComponentPropsWithoutRef<'textarea'>, 'onChange' | 'value'> {
	label?: ReactNode
	value?: string
	/** Receives the value string. */
	onChange?: (value: string) => void
	/** Message shown under the field; also sets the invalid style. */
	error?: ReactNode
	/** Hint shown under the field while there is no `error`; linked with `aria-describedby`. */
	helperText?: ReactNode
	/** Allow vertical resizing (default true). */
	resize?: boolean
}

/**
 * Labelled multi-line input. `onChange` receives the value string. With `maxLength` a live character count is shown;
 * `error` shows a message and sets the invalid style.
 */
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
	(
		{ label, value = '', onChange, error, helperText, rows = 4, maxLength, resize = true, className = '', ...rest },
		ref
	) => {
		const id = useId()
		const errorId = `${id}-error`
		const helperId = `${id}-helper`
		return (
			<div className="flex flex-col gap-1">
				{label && <Label htmlFor={id}>{label}</Label>}
				<textarea
					ref={ref}
					id={id}
					rows={rows}
					maxLength={maxLength}
					value={value}
					onChange={e => onChange?.(e.target.value)}
					aria-invalid={!!error}
					aria-describedby={error ? errorId : helperText ? helperId : undefined}
					className={`${inputClass(!!error)} ${resize ? 'resize-y' : 'resize-none'} ${className}`}
					{...rest}
				/>
				{(error || helperText || maxLength !== undefined) && (
					<div className="flex justify-between gap-2 text-xs">
						{error ? (
							<span id={errorId} className="text-red-700 dark:text-red-400">
								{error}
							</span>
						) : (
							helperText && <HelperText id={helperId}>{helperText}</HelperText>
						)}
						{maxLength !== undefined && (
							<span className="ml-auto text-app-muted">
								{value.length} / {maxLength}
							</span>
						)}
					</div>
				)}
			</div>
		)
	}
)
TextArea.displayName = 'TextArea'

export default TextArea
