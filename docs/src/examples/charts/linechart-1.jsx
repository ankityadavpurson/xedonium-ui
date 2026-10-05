import { LineChart } from 'xedonium'

export default function Demo() {
	return (
		<LineChart
			label="Visits per month"
			labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
			series={[
				{ name: 'Visits', values: [120, 180, 150, 240, 310, 280] },
				{ name: 'Signups', values: [30, 45, 40, 80, 95, 90] },
			]}
		/>
	)
}
