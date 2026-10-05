import { useState } from 'react'
import { DatePicker } from 'xedonium'

export default function Demo() {
	const [date, setDate] = useState(null)
	return (
		<div className="w-64">
			<DatePicker label="Due date" value={date} onChange={setDate} />
		</div>
	)
}
