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
	],
}
