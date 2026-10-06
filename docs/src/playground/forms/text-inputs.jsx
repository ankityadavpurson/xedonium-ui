import { useState } from 'react'
import { Field, Input, MultiSelect, PasswordInput, SearchSelect, Select, TextArea } from 'xedonium'

export default function Demo() {
	const [name, setName] = useState('')
	const [input, setInput] = useState('')
	const [role, setRole] = useState('')
	const [notes, setNotes] = useState('')
	const [password, setPassword] = useState('')
	const [tags, setTags] = useState([])
	const [city, setCity] = useState('')

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
			<div className="w-64">
				<MultiSelect
					label="Tags"
					value={tags}
					onChange={setTags}
					placeholder="Pick tags…"
					options={['Bug', 'Feature', 'Docs', 'Chore'].map(x => ({ value: x, label: x }))}
				/>
			</div>
			<div className="w-64">
				<SearchSelect
					label="City"
					value={city}
					onChange={setCity}
					options={['Berlin', 'Lisbon', 'Madrid', 'Oslo', 'Paris'].map(x => ({ value: x, label: x }))}
				/>
			</div>
			<div className="w-64">
				<PasswordInput label="Password" value={password} onChange={setPassword} />
			</div>
			<div className="w-64">
				<TextArea label="Notes" value={notes} onChange={setNotes} maxLength={80} rows={3} />
			</div>
		</div>
	)
}
