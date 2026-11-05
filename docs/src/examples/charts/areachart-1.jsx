import { AreaChart } from 'xedonium'

export default function Demo() {
	return (
		<AreaChart
			label="Banana deliveries"
			labels={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
			series={[{ name: 'Bananas', values: [400, 520, 480, 700, 650] }]}
		/>
	)
}
