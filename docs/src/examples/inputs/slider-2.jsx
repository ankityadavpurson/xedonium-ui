import { useState } from 'react'
import { Slider } from 'xedonium'

const clock = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`

export default function Demo() {
	const [position, setPosition] = useState(75)
	return (
		<div className="max-w-sm pt-10">
			<Slider label="Position" value={position} max={300} showValue={false} valueLabel={clock} onChange={setPosition} />
		</div>
	)
}
