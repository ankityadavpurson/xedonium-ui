import { AreaChart } from 'xedonium'

export default function Demo() {
	return (
		<AreaChart
			smooth
			label="Minion energy"
			labels={['00', '04', '08', '12', '16', '20']}
			series={[{ name: 'Energy %', values: [12, 8, 45, 82, 60, 25] }]}
		/>
	)
}
