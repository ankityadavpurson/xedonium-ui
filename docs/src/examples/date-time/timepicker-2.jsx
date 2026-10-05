import { useState } from 'react'
import { TimePicker } from 'xedonium'

export default function Demo() {
	const [time, setTime] = useState('13:30')
	return (
		<div className="w-48 max-w-full">
			<TimePicker label="Meeting (9-5, 12-hour)" value={time} onChange={setTime} hour12 min="09:00" max="17:00" />
		</div>
	)
}
