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
					md: 'Shows on hover and keyboard focus. `placement` is `top`, `bottom`, `left`, `right` or `auto` (best fit), optionally with `-start` / `-end`; it flips when there is no room. On a `Button`, use `tooltip` and `tooltipPlacement`. For SVG shapes wrap them with `as="g"`, and add `followPointer` to place the tooltip at the mouse (the pie chart does this).\n\n`onlyIfTruncated` shows the tooltip only when text inside the trigger is cut off, for example a label with an ellipsis.',
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
					md: '`items: [{ key, label, description?, badge?, tone?, disabled?, hasDialog?, onClick }]`. Closes on outside click and\nEscape.\n\nItems can have an `icon`, shown before the label and hidden from screen readers.',
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
					md: 'Side panel dialog (`side`: `right` or `left`) with focus trap, Escape and backdrop to close.\n\nWhile `busy`, Escape, the backdrop and the close button are ignored, as in `Modal`; `busyOverlay` also covers the body with a spinner. `initialFocusRef` picks the element focused on open; otherwise it is the one marked `data-autofocus`, else the first control (the Close button).',
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
					md: '`Modal` is the dialog shell and `ConfirmDialog` is built on it. `ActionMenu` doubles as the dropdown / menu\ncomponent.\n\n`ConfirmDialog` shows a spinner on the confirm button while `busy`; Escape, backdrop and close are ignored then. Use\n`tone="danger"` for destructive actions.\n\nWhen a `Modal` or `Drawer` opens, focus goes to the first control, which is the Close button. To focus something else\n(the first field of a form, say), put the `data-autofocus` attribute on it or pass a ref as `initialFocusRef`.\n\n`fullScreenBelow="sm"` (or `"md"`) makes the dialog fill the screen below that breakpoint, which suits long forms on phones. With `as="form"`, form attributes such as `noValidate`, `autoComplete` and `method` are passed through. `initialFocusRef` chooses the element focused on open.',
				},
				{
					example: 1,
				},
				{
					example: 2,
				},
				{
					md: '**Full screen.** `fullScreen` makes a `Modal` fill the viewport at every size (no margin, border or maximum width, safe areas respected, and the page behind does not scroll): good for a file, a log or a long form. `fullScreenToggle` adds a button to the header that switches between the dialog and full screen, `defaultFullScreen` sets where it starts, and `onFullScreenChange` reports the switch (pass `fullScreen` yourself to control it).',
				},
				{
					example: 3,
				},
			],
		},
		{
			slug: 'toast',
			name: 'Toast',
			blocks: [
				{
					md: 'Drive it with [`useTimedToast`](/hooks/usetimedtoast); render `<Toast toasts={toasts} onClose={hideToast} />` once. Several toasts stack (newest at the bottom); beyond `max` (default 5) the oldest is dropped. Types: `success`, `danger` (or `error`), `warning`, `info`. Pass `actions: [{ label, onClick }]` for buttons (use `duration: 0` so it stays until the user acts), `link` for a link, and `onClose` for a dismiss button. `position` places the stack in any of nine spots, from `top-left` to `bottom-right`. The live region is always mounted so\nscreen readers announce changes.',
				},
				{ example: 1 },
			],
		},
		{
			slug: 'backdrop',
			name: 'Backdrop',
			blocks: [
				{
					md: 'A dimmed layer over the page that blocks interaction behind it, with optional `children` centered on it: a `Loader` while something saves, an image to preview. Give it `onClose` and clicking the dimmed area (not the children) or pressing Escape closes it. `invisible` keeps it transparent but still click-blocking, and `fullScreen={false}` covers only the nearest positioned parent.\n\nIt does not trap focus or lock scrolling: for dialogs use [Dialog (Modal)](/components/overlay/dialog).',
				},
				{
					example: 1,
				},
			],
		},
	],
}
