export default {
	slug: 'charts',
	label: 'Charts',
	description:
		'Dependency-free SVG charts that follow the theme. labels names the x positions; each series is { name, values, color? } with one value per label.',
	components: [
		{
			slug: 'linechart',
			name: 'LineChart',
			blocks: [
				{
					example: 1,
				},
			],
		},
		{
			slug: 'areachart',
			name: 'AreaChart',
			blocks: [
				{
					md: 'Same props as `LineChart` with the area under each line filled.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'barchart',
			name: 'BarChart',
			blocks: [
				{
					md: 'Series are grouped by default; add `stacked` to stack them.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'piechart',
			name: 'PieChart',
			blocks: [
				{
					md: '`data: [{ label, value, color? }]`. Add `donut` (and optionally `center`) for a ring.',
				},
				{
					example: 1,
				},
			],
		},
	],
}
