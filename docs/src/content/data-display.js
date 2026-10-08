export default {
	slug: 'data-display',
	label: 'Data display',
	description: 'Cards, tables, lists, trees and timelines.',
	components: [
		{
			slug: 'accordion',
			name: 'Accordion',
			blocks: [
				{
					md: '`items: [{ key, title, content, disabled? }]`. One section is open at a time unless `multiple` is set. Control it with `value` (array of open keys) and `onChange`, or use `defaultValue`.',
				},
				{
					example: 1,
				},
				{
					md: 'By default the items share one border. Set `gap` to `sm`, `md` or `lg` to space them apart as separate bordered items.',
				},
				{
					example: 2,
				},
				{
					md: '`AccordionSection` is one collapsible section on its own, for pages that put other content between sections. Control it with `open` and `onChange`, or use `defaultOpen`.',
				},
				{
					example: 3,
				},
			],
		},
		{
			slug: 'codedisplay',
			name: 'CodeDisplay',
			blocks: [
				{
					md: 'Read-only code block with a copy button. Optional `title`, `language` caption, `lineNumbers`, `wrap` and `maxHeight`. Code is colored by `language` (`js`, `jsx`, `ts`, `tsx`, `json`, `bash`, `sh`) with a palette that follows the light / dark theme; turn it off with `highlight={false}` or override any color with `colors`.',
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
			slug: 'badge',
			name: 'Badge',
			blocks: [
				{
					md: 'Overlays a small indicator on the corner of its children, like MUI\'s Badge. `badgeContent` is a number or text; numbers above `max` show as "99+" and zero is hidden unless `showZero`. `variant="dot"` shows a plain dot, `anchorOrigin` picks the corner, `overlap="circular"` fits round children, and `invisible` hides it. Colors: `default`, `secondary`, `success`, `danger`, `warning`, `info`. A Badge is an indicator that sits on top of another element (a count on an icon); it is not a status label. For a standalone status pill such as "Active" or "Failed", use [`Chip`](/components/data-display/chip) with a `tone`.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'chip',
			name: 'Chip',
			blocks: [
				{
					md: 'Compact tag for filters and selections. `onClick` makes it a toggle button (with `selected` for the pressed state); `onRemove` adds a remove button; `leading` shows an icon or avatar first. `tone` (`default`, `success`, `warning`, `danger`, `info`) colours it, and `filled` makes the colour solid, so a Chip is also the component for a status label; use [`Badge`](/components/data-display/badge) only to overlay a count or dot on another element.',
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
			slug: 'card',
			name: 'Card',
			blocks: [
				{
					md: 'On narrow screens the header wraps, so `actions` drop below a long title or subtitle instead of squeezing it.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'table',
			name: 'Table',
			blocks: [
				{
					md: '`columns: [{ key, header, render?(row), align? }]`; `rowKey` (default `id`) names the unique field.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'datagrid',
			name: 'DataGrid',
			blocks: [
				{
					md: 'Table with sorting (click a sortable header: ascending, descending, off), search, pagination and row selection.\n`columns: [{ key, header, sortable?, render?(row), align?, accessor?(row) }]`. Selection is uncontrolled with\n`selectable`, or controlled with `selected` and `onSelectionChange`.\n\nColumns also take `className`, `headerClassName`, `width`, `minWidth` and `hideBelow` (`sm`, `md` or `lg`, hides the column on smaller screens). `loading` swaps the rows for skeletons and sets `aria-busy`. `hideFooterWhenSinglePage` hides the row count and pager when every row fits on one page.',
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
			slug: 'tree',
			name: 'Tree',
			blocks: [
				{
					md: '`nodes: [{ key, label, children? }]`. Keyboard: Up / Down move, Right expands or enters, Left collapses or goes to\nthe parent, Enter selects. Pass `defaultExpanded` (keys), or control it with `expanded` + `onExpandedChange`.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'timeline',
			name: 'Timeline',
			blocks: [
				{
					md: '`tone`: `default`, `success`, `warning`, `danger`.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'list',
			name: 'List',
			blocks: [
				{
					example: 1,
				},
			],
		},
	],
}
