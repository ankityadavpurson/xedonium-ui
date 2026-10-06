import { AreaChart, BarChart, Card, LineChart, PieChart } from 'xedonium'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
const series = [
	{ name: 'Visits', values: [12, 19, 14, 25, 22, 30] },
	{ name: 'Wakes', values: [5, 9, 7, 12, 10, 16] },
]

export default function Demo() {
	return (
		<div className="flex flex-wrap items-stretch gap-3">
			<Card title="Line" className="min-w-0 flex-1 basis-80">
				<LineChart labels={months} series={series} height={220} />
			</Card>
			<Card title="Area" className="min-w-0 flex-1 basis-80">
				<AreaChart labels={months} series={series} height={220} />
			</Card>
			<Card title="Bar" className="min-w-0 flex-1 basis-80">
				<BarChart labels={months} series={series} height={220} />
			</Card>
			<Card title="Stacked" className="min-w-0 flex-1 basis-80">
				<BarChart labels={months} series={series} height={220} stacked />
			</Card>
			<Card title="Pie" className="min-w-0 flex-1 basis-60">
				<PieChart
					data={[
						{ label: 'A', value: 40 },
						{ label: 'B', value: 25 },
						{ label: 'C', value: 20 },
						{ label: 'D', value: 15 },
					]}
				/>
			</Card>
			<Card title="Donut" className="min-w-0 flex-1 basis-60">
				<PieChart
					donut
					center="100"
					data={[
						{ label: 'Up', value: 90 },
						{ label: 'Down', value: 10 },
					]}
				/>
			</Card>
		</div>
	)
}
