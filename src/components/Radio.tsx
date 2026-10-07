import { useId, type ComponentPropsWithoutRef, type ReactNode } from 'react'

export interface RadioProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
	label?: ReactNode
}

/** Single radio; normally used through RadioGroup. */
const Radio = ({ label, className = '', disabled = false, ...rest }: RadioProps) => {
	const id = useId()
	return (
		<label
			htmlFor={id}
			className={`inline-flex min-h-8 items-center gap-2 text-sm text-app-text ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${className}`}
		>
			<input
				id={id}
				type="radio"
				disabled={disabled}
				className="h-4 w-4 cursor-[inherit] accent-[rgb(var(--color-app-strong))]"
				{...rest}
			/>
			{label}
		</label>
	)
}

export default Radio
