import { useState } from 'react'
import { Button, PieChart } from 'xedonium'

const random = () => [
	{ label: 'Kevin', value: Math.round(20 + Math.random() * 60) },
	{ label: 'Stuart', value: Math.round(10 + Math.random() * 40) },
	{ label: 'Bob', value: Math.round(5 + Math.random() * 30) },
]

export default function Demo() {
	const [data, setData] = useState(random)
	return (
		<div className="flex flex-col gap-3">
			<div>
				<Button variant="secondary" onClick={() => setData(random())}>
					New data
				</Button>
			</div>
			<PieChart label="Favourite Minion" data={data} />
		</div>
	)
}
