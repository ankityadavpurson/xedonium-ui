import { useState } from 'react'
import { Field, Input, Select } from 'xedonium'

export default function Demo() {
	const [name, setName] = useState('')
	const [input, setInput] = useState('')
	const [role, setRole] = useState('')

	return (
		<div className="flex flex-wrap items-start gap-3">
			<div className="w-64">
				<Field
					label="Name"
					value={name}
					onChange={setName}
					placeholder="Type here"
					error={name === 'x' ? 'Too short' : ''}
				/>
			</div>
			<div className="w-64">
				<Input value={input} onChange={setInput} placeholder="Bare input" />
			</div>
			<div className="w-64">
				<Input value="Invalid" onChange={() => {}} invalid />
			</div>
			<div className="w-64">
				<Select
					label="Role"
					value={role}
					onChange={setRole}
					placeholder="Choose…"
					options={[
						{ value: 'a', label: 'Admin' },
						{ value: 'e', label: 'Editor' },
						{ value: 'v', label: 'Viewer', disabled: true },
					]}
				/>
			</div>
		</div>
	)
}
