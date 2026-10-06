export default {
	slug: 'utilities',
	label: 'Utilities',
	description: 'Helpers for focus, portals, shortcuts, reordering and large lists.',
	components: [
		{
			slug: 'portal',
			name: 'Portal',
			blocks: [
				{
					md: '`<Portal>` renders children into `document.body` (or `container`) so clipped or transformed ancestors cannot trap\nthem.',
				},
				{ example: 1 },
			],
		},
		{
			slug: 'focustrap',
			name: 'FocusTrap',
			blocks: [
				{
					md: 'Keeps Tab inside while `active`, focuses the first control (or an element with `data-autofocus`), and restores focus\non deactivation.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'sortablelist',
			name: 'SortableList (drag and drop)',
			blocks: [
				{
					md: "Reorder by dragging, or focus a row's handle and press Up / Down. Items need a unique `key`; `onChange` receives the\nnew order.",
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'virtuallist',
			name: 'VirtualList',
			blocks: [
				{
					md: 'Renders only the visible rows of a long list. Rows need a fixed `itemHeight`.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'usekeyboardshortcuts',
			name: 'useKeyboardShortcuts',
			blocks: [
				{
					example: 1,
				},
				{
					md: '`mod` is Cmd on macOS and Ctrl elsewhere. Shortcuts without a modifier are ignored while typing in a field. More in [useKeyboardShortcuts](/hooks/usekeyboardshortcuts).',
				},
			],
		},
	],
}
