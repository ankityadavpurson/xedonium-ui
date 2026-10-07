import { useId, type ReactNode } from 'react'
import Label from './Label'
import Radio from './Radio'

export interface RadioOption<V extends string | number = string> {
	value: V
	label: ReactNode
	disabled?: boolean
}

export interface RadioGroupProps<V extends string | number = string> {
	label?: ReactNode
	/** Shared `name`; generated when omitted. */
	name?: string
	value?: V
	/** Receives the chosen value. */
	onChange?: (value: V) => void
	options: RadioOption<V>[]
	direction?: 'row' | 'column'
}

/** Group of radios sharing one value. options: [{ value, label, disabled? }]. `onChange` receives the value. */
const RadioGroup = <V extends string | number = string>({
	label,
	name,
	value,
	onChange,
	options,
	direction = 'column',
}: RadioGroupProps<V>) => {
	const generated = useId()
	return (
		<fieldset className="flex flex-col gap-2 border-0 p-0">
			{label && (
				<Label as="legend" className="mb-1">
					{label}
				</Label>
			)}
			<div className={`flex gap-3 ${direction === 'row' ? 'flex-row flex-wrap' : 'flex-col'}`}>
				{options.map(option => (
					<Radio
						key={option.value}
						name={name ?? generated}
						value={option.value}
						label={option.label}
						disabled={option.disabled}
						checked={value === option.value}
						onChange={() => onChange?.(option.value)}
					/>
				))}
			</div>
		</fieldset>
	)
}

export default RadioGroup
