import { useState } from 'react'
import { MultiSelect } from 'xedonium'

export default function Demo() {
	const [fruits, setFruits] = useState(['apple'])
	return (
		<div className="max-w-sm">
			<MultiSelect
				label="Fruit"
				searchable
				value={fruits}
				onChange={setFruits}
				placeholder="Pick some…"
				options={[
					{ value: 'apple', label: 'Apple' },
					{ value: 'pear', label: 'Pear' },
					{ value: 'plum', label: 'Plum', disabled: true },
					{ value: 'fig', label: 'Fig' },
				]}
			/>
		</div>
	)
}
