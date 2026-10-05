import { Grid } from 'xedonium'

export default function Demo() {
	return (
		<Grid cols={3} gap={3}>
			{[1, 2, 3, 4, 5, 6].map(n => (
				<div key={n} className="border border-app-border bg-app-card p-4 text-center text-sm">
					{n}
				</div>
			))}
		</Grid>
	)
}
