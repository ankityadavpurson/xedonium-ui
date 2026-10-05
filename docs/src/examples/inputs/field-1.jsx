import { useState } from 'react'
import { Field } from 'xedonium'

export default function Demo() {
	const [name, setName] = useState('')
	return (
		<div className="w-72">
			<Field
				label="Name"
				value={name}
				onChange={setName}
				placeholder="Type here"
				error={name === 'x' ? 'Too short' : ''}
			/>
		</div>
	)
}
