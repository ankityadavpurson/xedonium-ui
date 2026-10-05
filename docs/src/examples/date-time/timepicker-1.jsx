import { useState } from 'react'
import { TimePicker } from 'xedonium'

export default function Demo() {
	const [time, setTime] = useState('09:30')
	return (
		<div className="w-40 max-w-full">
			<TimePicker label="Start" value={time} onChange={setTime} />
		</div>
	)
}
