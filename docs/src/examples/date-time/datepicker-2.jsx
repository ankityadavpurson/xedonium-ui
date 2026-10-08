import { useState } from 'react'
import { DateTimePicker } from 'xedonium'

export default function Demo() {
	const [value, setValue] = useState(null)
	return (
		<div className="max-w-sm">
			<DateTimePicker label="Starts" value={value} onChange={setValue} min={new Date()} />
			<p className="mt-2 text-xs text-app-muted">{value ? value.toString() : 'Pick a date and a time'}</p>
		</div>
	)
}
