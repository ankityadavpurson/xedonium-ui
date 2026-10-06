import { Button, Card, Dashboard, LineChart } from 'xedonium'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const series = [
	{ name: 'Visits', values: [12, 19, 14, 25, 22, 30] },
	{ name: 'Wakes', values: [5, 9, 7, 12, 10, 16] },
]

export default function Demo() {
	return (
		<Dashboard
			title="Overview"
			subtitle="Last 6 months"
			actions={<Button variant="secondary">Export</Button>}
			stats={[
				{ label: 'Visits', value: '1,204', delta: '+12%', trend: 'up' },
				{ label: 'Errors', value: '8', delta: '-3', trend: 'down' },
			]}
		>
			<Card title="Traffic">
				<LineChart labels={months} series={series} height={200} />
			</Card>
			<Card title="Notes">Anything goes here.</Card>
		</Dashboard>
	)
}
