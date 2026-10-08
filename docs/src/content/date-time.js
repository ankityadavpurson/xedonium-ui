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
					md: '`DateTimePicker` puts a date and a time picker side by side with one `Date` value, as a replacement for `<input type="datetime-local">`. Picking a date keeps the time and the other way round; `min` and `max` limit the time on the boundary day too.',
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
					md: 'Themed hour and minute columns (no native control). Values are 24-hour `"HH:MM"` strings; `step` is the minute granularity in seconds, `min` / `max` disable times outside a range, and `hour12` shows an AM / PM clock. Arrow keys move within a column and between columns.',
				},
				{
					example: 1,
				},
				{
					example: 2,
				},
			],
		},
	],
}
