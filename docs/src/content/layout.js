export default {
	slug: 'layout',
	label: 'Layout',
	description: 'Structural primitives for arranging content.',
	components: [
		{
			slug: 'container',
			name: 'Container',
			blocks: [
				{
					md: 'Centered, padded column. `maxWidth` takes a Tailwind class.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'stack-flex',
			name: 'Stack & Flex',
			blocks: [
				{
					md: '`Stack` is a vertical `Flex`; use `direction="row"` for horizontal. `gap` is 0-4, 6 or 8. `Flex` also takes `align`,\n`justify`, `wrap` and `inline`.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'grid',
			name: 'Grid',
			blocks: [
				{
					md: '`cols` is 1-6 or 12 and collapses on small screens unless `responsive={false}`.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'divider',
			name: 'Divider',
			blocks: [
				{
					example: 1,
				},
			],
		},
		{
			slug: 'pagelayout-and-pageheader',
			name: 'PageLayout and PageHeader',
			blocks: [
				{
					md: '`PageLayout` accepts `maxWidth`, `centerContent`, `themeToggle`, `outerClassName` and `innerClassName`. `PageHeader`\ntakes `title`, `subtitle` and action children.',
				},
				{
					example: 1,
				},
			],
		},
	],
}
