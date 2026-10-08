export default {
	slug: 'navigation',
	label: 'Navigation',
	description: 'Moving around an app: bars, tabs, breadcrumbs, pagination and steps.',
	components: [
		{
			slug: 'appbar',
			name: 'AppBar',
			blocks: [
				{
					md: "Sticky top bar. `links: [{ href, label, active?, ...extraLinkProps }]`. Also: `brand`, `logo`, `brandHref`, `actions`,\n`themeToggle`, `hideBrandOnMobile`, `linkComponent`, `linkProp`, `maxWidth`.\n\nInside the `header` of [`AppShell`](/components/application/appshell), pass `embedded` to drop the bar's own sticky frame, so there is no double border and no nested banner.",
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'tabs',
			name: 'Tabs',
			blocks: [
				{
					md: '`items: [{ key, label, content?, disabled? }]`. Controlled with `value` / `onChange`, or uncontrolled with\n`defaultValue`. Arrow, Home and End keys move between tabs.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'breadcrumb',
			name: 'Breadcrumb',
			blocks: [
				{
					md: 'The last item is the current page. Supports `linkComponent` / `linkProp` for routers.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'pagination',
			name: 'Pagination',
			blocks: [
				{
					md: '`page` is 1-based; `onChange` receives the new page. Add `pageSizeOptions`, `pageSize` and `onPageSizeChange` for a "Per page" select. Changing the size is up to you: usually go back to page 1 and recompute `pageCount`.\n\nThe buttons are 38px tall to line up with the per-page select, and Prev and Next share one width.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'stepper',
			name: 'Stepper',
			blocks: [
				{
					md: '`current` is the 0-based active step.',
				},
				{
					example: 1,
				},
				{
					md: '`ActionMenu` (see [ActionMenu](/components/overlay/actionmenu)) serves as the menu component.',
				},
			],
		},
		{
			slug: 'speed-dial',
			name: 'SpeedDial',
			blocks: [
				{
					md: 'A floating action button that fans out related actions. It opens on hover, on click and from the keyboard, and closes on outside click, Escape and after an action runs. `direction` (`up`, `down`, `left`, `right`) picks where the actions appear, `shape="circle"` makes every button round, and `position` fixes the whole control to a corner of the viewport.\n\nEach action needs a `label`: it is the tooltip and the accessible name. `showLabels` writes the labels beside the actions instead. Pass `icon` and `openIcon` to change the main button, and `color` (a variant name or any CSS color) to recolor it.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'menu',
			name: 'Menu',
			blocks: [
				{
					md: 'A menu of actions that opens from a trigger button, with icons, `shortcut` hints, dividers (`{ key, divider: true }`) and `tone="danger"` items. Arrow keys move, Home / End jump, Enter or Space chooses, and Escape closes the menu and returns focus to the trigger. Outside clicks close it. For a plain, flat list of page actions, [ActionMenu](/components/overlay/actionmenu) is lighter.',
				},
				{
					example: 1,
				},
				{
					md: '**Nested menus:** give an item `children` to make it open a submenu, to any depth. Hovering the item or pressing Right opens it, Left or Escape closes just that level, and a click anywhere in an open submenu counts as inside the menu.',
				},
				{
					example: 2,
				},
				{
					md: 'Leave out `trigger` and pass `anchorRef` with `open` / `onOpenChange` to anchor the menu to your own element and control it yourself.',
				},
				{
					example: 3,
				},
			],
		},
	],
}
