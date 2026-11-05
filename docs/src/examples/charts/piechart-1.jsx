import { Grid, PieChart } from 'xedonium'

export default function Demo() {
	return (
		<Grid cols={2}>
			<PieChart
				label="Favourite Minion"
				data={[
					{ label: 'Kevin', value: 62 },
					{ label: 'Stuart', value: 21 },
					{ label: 'Bob', value: 9 },
					{ label: 'Others', value: 8 },
				]}
			/>
			<PieChart
				donut
				center="100%"
				label="Bananas"
				data={[
					{ label: 'Eaten', value: 70 },
					{ label: 'Left', value: 30 },
				]}
			/>
		</Grid>
	)
}
