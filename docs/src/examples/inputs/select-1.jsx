import { useState } from 'react'
import { Select } from 'xedonium'

export default function Demo() {
	const [banana, setBanana] = useState('cavendish')
	return (
		<div className="max-w-sm">
			<Select
				label="Banana"
				value={banana}
				onChange={setBanana}
				options={[
					{ value: 'cavendish', label: 'Cavendish' },
					{ value: 'plantain', label: 'Plantain' },
					{ value: 'red', label: 'Red banana (sold out)', disabled: true },
				]}
			/>
		</div>
	)
}
