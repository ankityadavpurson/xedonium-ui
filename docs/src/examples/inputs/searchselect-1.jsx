import { useState } from 'react'
import { SearchSelect } from 'xedonium'

const minions = ['Kevin', 'Stuart', 'Bob', 'Dave', 'Carl', 'Phil', 'Jerry', 'Tim', 'Mark']

export default function Demo() {
	const [minion, setMinion] = useState('')
	return (
		<div className="max-w-sm">
			<SearchSelect
				label="Minion"
				value={minion}
				onChange={setMinion}
				options={minions.map(name => ({ value: name, label: name }))}
			/>
		</div>
	)
}
