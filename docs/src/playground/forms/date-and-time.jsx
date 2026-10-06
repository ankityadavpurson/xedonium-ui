import { useState } from 'react'
import { DatePicker, DateRangePicker, TimePicker } from 'xedonium'

export default function Demo() {
	const [date, setDate] = useState(null)
	const [range, setRange] = useState({ start: null, end: null })
	const [time, setTime] = useState('09:30')

	return (
		<div className="flex flex-wrap items-start gap-3">
			<div className="w-56">
				<DatePicker label="Date" value={date} onChange={setDate} />
			</div>
			<div className="w-72">
				<DateRangePicker label="Range" value={range} onChange={setRange} />
			</div>
			<div className="w-40">
				<TimePicker label="Time" value={time} onChange={setTime} />
			</div>
		</div>
	)
}
