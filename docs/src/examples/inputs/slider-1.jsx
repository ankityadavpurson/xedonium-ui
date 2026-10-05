import { useState } from 'react'
import { Slider } from 'xedonium'

export default function Demo() {
	const [volume, setVolume] = useState(40)
	return (
		<div className="max-w-sm">
			<Slider label="Volume" value={volume} onChange={setVolume} />
		</div>
	)
}
