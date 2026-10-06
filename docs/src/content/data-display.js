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
			],
		},
		{
			slug: 'codedisplay',
			name: 'CodeDisplay',
			blocks: [
				{
					md: 'Read-only code block with a copy button. Optional `title`, `language` caption, `lineNumbers`, `wrap` and `maxHeight`. No syntax highlighting is applied.',
				},
				{
					example: 1,
				},
			],
		},
		{
			slug: 'card',
			name: 'Card',
			blocks: [
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
					md: 'Table with sorting (click a sortable header: ascending, descending, off), search, pagination and row selection.\n`columns: [{ key, header, sortable?, render?(row), align?, accessor?(row) }]`. Selection is uncontrolled with\n`selectable`, or controlled with `selected` and `onSelectionChange`.',
				},
				{
					example: 1,
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
