import { useId } from 'react'
import Radio from './Radio'

/** Group of radios sharing one value. options: [{ value, label, disabled? }]. `onChange` receives the value. */
const RadioGroup = ({ label, name, value, onChange, options, direction = 'column' }) => {
	const generated = useId()
	return (
		<fieldset className="flex flex-col gap-2 border-0 p-0">
			{label && (
				<legend className="mb-1 text-xs font-semibold uppercase tracking-widest text-app-muted">{label}</legend>
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
