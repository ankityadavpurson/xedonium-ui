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
					md: '**Default** (`jumpMode="none"`): the title is plain text and you page month by month with the arrows.',
				},
				{
					example: 1,
				},
				{
					md: '**Jump modes**: `jumpMode="dropdown"` (left) opens a month and year picker from the title; `jumpMode="input"` (right) opens a DD / MM / YYYY entry from the title.',
				},
				{
					example: 2,
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
			slug: 'relativetime',
			name: 'RelativeTime',
			blocks: [
				{
					md: 'A moment as a live relative label, such as `3 minutes ago`, `yesterday` or `in 2 months`, in a `<time>` element. Hover or focus it to see the full date and time, to the second and with the time zone, in a Tooltip. `date` takes a `Date`, a timestamp or an ISO string.\n\nDays and shorter units use words (`yesterday`, `tomorrow`); months and years always use numbers, so a list reads in one style. Up to a minute in the future reads as `now`, which hides a server clock running slightly ahead of the browser.',
				},
				{
					example: 1,
				},
				{
					md: '**Tick**: labels update every 30 seconds. Every `RelativeTime` with the same `tick` shares one timer, which stops when none of them is mounted, so a long list stays cheap. Set `tick` in milliseconds (at least `1000`), such as `tick={1000}` for a label that counts seconds, or `tick={false}` for a label that does not update: it is worked out when the component renders, with no timer at all.',
				},
				{
					example: 2,
				},
				{
					md: '**Locale**: labels are English by default. Pass `locale` (`fr`, `de`, `ja`, `en-GB`...) for both the label and the tooltip. `tooltip={false}` leaves out the tooltip, the dotted underline and the tab stop.\n\nThe formatters are exported too, for use outside React: `formatRelative(date, now?, locale?)` and `formatAbsolute(date, locale?, timeZone?)`.\n\nWith [server rendering](/foundations/server-rendering) the server writes a label for the moment it renders, and the browser replaces it right after hydration, so a page built days ago does not keep saying `5 minutes ago`.',
				},
				{
					example: 3,
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
