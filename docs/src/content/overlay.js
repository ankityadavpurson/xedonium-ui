export default {
	slug: 'overlay',
	label: 'Overlay',
	description: 'Dialogs, panels and floating content.',
	components: [
		{
			slug: 'tooltip',
			name: 'Tooltip',
			blocks: [
				{
					md: 'Shows on hover and keyboard focus. `placement` is `top`, `bottom`, `left`, `right` or `auto` (best fit), optionally with `-start` / `-end`; it flips when there is no room. On a `Button`, use `tooltip` and `tooltipPlacement`.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'actionmenu',
			name: 'ActionMenu',
			blocks: [
				{
					md: '`items: [{ key, label, description?, badge?, tone?, disabled?, hasDialog?, onClick }]`. Closes on outside click and\nEscape.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'drawer',
			name: 'Drawer',
			blocks: [
				{
					md: 'Side panel dialog (`side`: `right` or `left`) with focus trap, Escape and backdrop to close.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'popover',
			name: 'Popover',
			blocks: [
				{
					md: 'Button that toggles a floating panel with any content. Closes on outside click and Escape.',
				},
				{
					example: 1,
				},
				{
					md: '**Never clipped.** `Popover`, `ActionMenu`, `Select`, `DatePicker`, `DateRangePicker`, `TimePicker` and `NotificationCenter` render their panels into the page body, so containers with `overflow: hidden` or scrolling cannot cut them off. They flip to the other side when there is no room, and `placement` chooses where they open.',
				},
				{
					example: 2,
				},
			],
		},
		{
			slug: 'dialog',
			name: 'Dialog (Modal)',
			blocks: [
				{
					md: '`Modal` is the dialog shell and `ConfirmDialog` is built on it. `ActionMenu` doubles as the dropdown / menu\ncomponent.\n\n`ConfirmDialog` shows a spinner on the confirm button while `busy`; Escape, backdrop and close are ignored then. Use\n`tone="danger"` for destructive actions.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'toast',
			name: 'Toast',
			blocks: [
				{
					md: 'Drive it with [`useTimedToast`](/hooks); render `<Toast toast={toast} />` once. The live region is always mounted so\nscreen readers announce changes.',
				},
				{ example: 1 },
			],
		},
	],
}
