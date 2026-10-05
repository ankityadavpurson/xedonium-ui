import { useId } from 'react'
import Label from './Label'
import Radio from './Radio'

/** Group of radios sharing one value. options: [{ value, label, disabled? }]. `onChange` receives the value. */
const RadioGroup = ({ label, name, value, onChange, options, direction = 'column' }) => {
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
