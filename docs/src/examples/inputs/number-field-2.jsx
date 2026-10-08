import { useState } from 'react'
import { NumberField } from 'xedonium'

export default function Demo() {
	const [age, setAge] = useState(null)
	const [volume, setVolume] = useState(30)

	return (
		<div className="flex max-w-xs flex-col gap-4">
			<NumberField
				label="Age"
				value={age}
				onChange={setAge}
				min={18}
				max={99}
				placeholder="18 or older"
				error={age !== null && age < 18 ? 'You must be at least 18' : undefined}
			/>
			<NumberField
				label="Volume (steps of 10, no buttons)"
				value={volume}
				onChange={setVolume}
				step={10}
				min={0}
				max={100}
				showControls={false}
			/>
			<NumberField label="Disabled" value={5} disabled />
		</div>
	)
}
