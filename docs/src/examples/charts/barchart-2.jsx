import { useState } from 'react'
import { BarChart, Button } from 'xedonium'

const random = () => Array.from({ length: 6 }, () => Math.round(20 + Math.random() * 80))

export default function Demo() {
	const [values, setValues] = useState(random)
	return (
		<div className="flex flex-col gap-3">
			<div>
				<Button variant="secondary" onClick={() => setValues(random())}>
					New data
				</Button>
			</div>
			<BarChart
				label="Orders per month"
				labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
				series={[{ name: 'Orders', values }]}
			/>
		</div>
	)
}
