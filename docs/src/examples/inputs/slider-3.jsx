import { useState } from 'react'
import { Slider } from 'xedonium'

export default function Demo() {
	const [position, setPosition] = useState(20)
	return (
		<div className="max-w-sm">
			<Slider label="Playback" value={position} buffered={65} onChange={setPosition} />
		</div>
	)
}
