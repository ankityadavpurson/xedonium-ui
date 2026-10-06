export default {
	slug: 'charts',
	label: 'Charts',
	description:
		'Dependency-free SVG charts that follow the theme. labels names the x positions; each series is { name, values, color? } with one value per label. Charts animate in when they appear and glide to the new values when their data changes (pass `animate={false}` to turn it off); users who prefer reduced motion never see the animation.',
	components: [
		{
			slug: 'linechart',
			name: 'LineChart',
			blocks: [
				{
					example: 1,
				},
				{
					md: 'Add `smooth` for curves instead of straight segments. The curve still passes through every point and never overshoots it, so a smooth line cannot dip below the data or past the axis.',
				},
				{
					example: 2,
				},
				{
					md: 'When the data changes, the lines glide to their new positions instead of redrawing (pass `animate={false}` for an instant update).',
				},
				{
					example: 3,
				},
			],
		},
		{
			slug: 'areachart',
			name: 'AreaChart',
			blocks: [
				{
					md: 'Same props as `LineChart` with the area under each line filled, including `smooth`.',
				},
				{
					example: 1,
				},
				{
					example: 2,
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
				{
					md: 'Charts animate in when they appear, and when the data changes the bars glide to their new height. Press the button to try it; `animate={false}` turns it off.',
				},
				{
					example: 2,
				},
			],
		},
		{
			slug: 'piechart',
			name: 'PieChart',
			blocks: [
				{
					md: '`data: [{ label, value, color? }]`. Add `donut` (and optionally `center`) for a ring. Hover a slice for its label, value and share in a tooltip that follows the mouse.',
				},
				{
					example: 1,
				},
				{
					md: 'When the data changes the slices swing to their new size; the tooltip and legend always show the real values.',
				},
				{
					example: 2,
				},
			],
		},
	],
}
