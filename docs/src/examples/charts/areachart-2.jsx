import { AreaChart } from 'xedonium'

export default function Demo() {
	return (
		<AreaChart
			smooth
			label="Server load"
			labels={['00', '04', '08', '12', '16', '20']}
			series={[{ name: 'CPU %', values: [12, 8, 45, 82, 60, 25] }]}
		/>
	)
}
