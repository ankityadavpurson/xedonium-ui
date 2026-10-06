import { useState } from 'react'
import { Button, LineChart } from 'xedonium'

const random = () => Array.from({ length: 7 }, () => Math.round(20 + Math.random() * 80))

export default function Demo() {
	const [values, setValues] = useState(random)
	return (
		<div className="flex flex-col gap-3">
			<div>
				<Button variant="secondary" onClick={() => setValues(random())}>
					New data
				</Button>
			</div>
			<LineChart
				smooth
				label="Response time"
				labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
				series={[{ name: 'ms', values }]}
			/>
		</div>
	)
}
