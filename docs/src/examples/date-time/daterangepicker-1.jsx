import { useState } from 'react'
import { DateRangePicker } from 'xedonium'

export default function Demo() {
	const [range, setRange] = useState({ start: null, end: null })
	return (
		<div className="w-72">
			<DateRangePicker label="Stay" value={range} onChange={setRange} />
		</div>
	)
}
