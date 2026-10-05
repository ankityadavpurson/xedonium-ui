import { useState } from 'react'
import { RadioGroup } from 'xedonium'

export default function Demo() {
	const [size, setSize] = useState('m')
	return (
		<RadioGroup
			label="Size"
			value={size}
			onChange={setSize}
			direction="row"
			options={[
				{ value: 's', label: 'Small' },
				{ value: 'm', label: 'Medium' },
				{ value: 'l', label: 'Large' },
			]}
		/>
	)
}
