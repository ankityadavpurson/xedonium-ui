import { AreaChart } from 'xedonium'

export default function Demo() {
	return (
		<AreaChart
			label="Traffic"
			labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
			series={[{ name: 'Requests', values: [400, 520, 480, 700, 650] }]}
		/>
	)
}
