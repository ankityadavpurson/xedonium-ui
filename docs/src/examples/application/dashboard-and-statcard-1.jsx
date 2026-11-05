import { Card, Dashboard, LineChart, PieChart } from 'xedonium'

export default function Demo() {
	return (
		<Dashboard
			title="Lair overview"
			subtitle="Last 30 days"
			stats={[
				{ label: 'Bananas', value: '48k', delta: '12%', trend: 'up' },
				{ label: 'Slips', value: '2.1%', delta: '0.4%', trend: 'down' },
				{ label: 'Minions', value: '3,204', hint: 'on duty' },
			]}
		>
			<Card title="Mischief">
				<LineChart
					labels={['Kevin', 'Stuart', 'Bob', 'Dave']}
					series={[{ name: 'Pranks', values: [3, 7, 5, 9] }]}
					height={200}
				/>
			</Card>
			<Card title="Banana share">
				<PieChart
					donut
					data={[
						{ label: 'Kevin', value: 3 },
						{ label: 'Stuart', value: 2 },
					]}
				/>
			</Card>
		</Dashboard>
	)
}
