import { LineChart } from 'xedonium'

export default function Demo() {
	return (
		<LineChart
			label="Minion sightings per month"
			labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
			series={[
				{ name: 'Sightings', values: [120, 180, 150, 240, 310, 280] },
				{ name: 'Recruits', values: [30, 45, 40, 80, 95, 90] },
			]}
		/>
	)
}
