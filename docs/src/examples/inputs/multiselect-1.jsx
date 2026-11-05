import { useState } from 'react'
import { MultiSelect } from 'xedonium'

export default function Demo() {
	const [minions, setMinions] = useState(['kevin'])
	return (
		<div className="max-w-sm">
			<MultiSelect
				label="Minions"
				searchable
				value={minions}
				onChange={setMinions}
				placeholder="Pick some…"
				options={[
					{ value: 'kevin', label: 'Kevin' },
					{ value: 'stuart', label: 'Stuart' },
					{ value: 'bob', label: 'Bob (napping)', disabled: true },
					{ value: 'dave', label: 'Dave' },
				]}
			/>
		</div>
	)
}
