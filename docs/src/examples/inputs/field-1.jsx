import { useState } from 'react'
import { Field } from 'xedonium'

export default function Demo() {
	const [name, setName] = useState('')
	return (
		<div className="w-72 max-w-full">
			<Field
				label="Name"
				value={name}
				onChange={setName}
				placeholder="Type here"
				helperText="Shown until there is an error"
				error={name === 'x' ? 'Too short' : ''}
			/>
		</div>
	)
}
