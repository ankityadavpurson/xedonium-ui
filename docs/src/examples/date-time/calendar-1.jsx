import { useState } from 'react'
import { Calendar } from 'xedonium'

export default function Demo() {
	const [date, setDate] = useState(new Date())
	return <Calendar value={date} onChange={setDate} weekStartsOn={1} />
}
