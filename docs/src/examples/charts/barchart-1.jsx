import { BarChart } from 'xedonium'

export default function Demo() {
	return (
		<BarChart
			label="Revenue by quarter"
			labels={['Q1', 'Q2', 'Q3', 'Q4']}
			series={[
				{ name: '2024', values: [40, 55, 48, 70] },
				{ name: '2025', values: [52, 61, 66, 90] },
			]}
		/>
	)
}
