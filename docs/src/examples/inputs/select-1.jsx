import { useState } from 'react'
import { Select } from 'xedonium'

export default function Demo() {
	const [fruit, setFruit] = useState('apple')
	return (
		<div className="max-w-sm">
			<Select
				label="Fruit"
				value={fruit}
				onChange={setFruit}
				options={[
					{ value: 'apple', label: 'Apple' },
					{ value: 'pear', label: 'Pear' },
					{ value: 'plum', label: 'Plum', disabled: true },
				]}
			/>
		</div>
	)
}
