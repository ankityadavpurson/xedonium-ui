export default {
	slug: 'date-time',
	label: 'Date & time',
	description: 'Dependency-free pickers. Dates are plain Date objects at local midnight; pass locale to localise.',
	components: [
		{
			slug: 'calendar',
			name: 'Calendar',
			blocks: [
				{
					md: 'Arrow keys move by day or week, PageUp / PageDown by month, Home / End to the week edges. `min` / `max` disable days,\n`weekStartsOn` is 0 (Sunday) or 1 (Monday).',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'datepicker',
			name: 'DatePicker',
			blocks: [
				{
					example: 1,
				},
			],
		},
		{
			slug: 'daterangepicker',
			name: 'DateRangePicker',
			blocks: [
				{
					md: 'Click the start, then the end (either order). The value is `{ start, end }`.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'timepicker',
			name: 'TimePicker',
			blocks: [
				{
					md: 'Wraps the native time control, so it gets the platform\'s picker. Values are `"HH:MM"` strings; `step` is in seconds.',
				},
				{
					example: 1,
				},
			],
		},
	],
}
