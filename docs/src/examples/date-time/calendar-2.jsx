import { useState } from 'react'
import { Calendar } from 'xedonium'

export default function Demo() {
	const [date, setDate] = useState(new Date())
	return (
		<div className="flex flex-wrap items-start gap-4">
			<Calendar value={date} onChange={setDate} weekStartsOn={1} jumpMode="dropdown" />
			<Calendar value={date} onChange={setDate} weekStartsOn={1} jumpMode="input" />
		</div>
	)
}
