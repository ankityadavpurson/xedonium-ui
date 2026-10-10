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
			slug: 'nestedtable',
			name: 'NestedTable',
			blocks: [
				{
					md: 'A table whose rows expand. A row can hold nested `children` rows (a tree: departments and the people in them), a details panel from `renderDetails` (master and detail: a bill and the items on it), or both. Expansion is uncontrolled (`defaultExpanded`) or controlled (`expanded` + `onExpandedChange`); `canExpand` says which rows can open (by default those with `children`, or every row when there is `renderDetails`).',
				},
				{
					example: 1,
				},
				{
					md: '**Master and detail.** `renderDetails` shows anything under the row: here it is another `NestedTable` with `nested` (no border or scroll box of its own). `onExpand` is called each time a row opens, so details can load on demand, and `loadingKeys` puts a spinner on that row\'s button meanwhile. `exclusive` keeps one row open at a time, `rowActions` adds buttons to each row, and `expandPosition="end"` moves the expand button to a last column (`actionsHeader` names it). `rowKey` can be a function and `rowLabel` names a row for screen readers ("Expand bill B-1042").',
				},
				{
					example: 2,
				},
			],
		},
		{
			slug: 'logviewer',
			name: 'LogViewer',
			blocks: [
				{
					md: 'Log output you can filter and search. Pass `logs`: `{ id, level, message, timestamp?, source?, data?, stack? }` with `level` one of `debug`, `info`, `warn` or `error`. Filter by level (the buttons show how many there are of each), search the text (after a short pause; matches are highlighted), and open the full screen view (Escape leaves it). Errors stand out, a multi-line `message` shows its first line as the headline, `stack` is its own block with the `at ...` lines dimmed, and long `data` or long stacks are cut with "Show all".',
				},
				{
					example: 1,
				},
				{
					md: '**Live logs.** With `autoScroll` (the default) the viewer follows the newest entry, until the reader scrolls up: then it stops and offers "Jump to latest" (`onAutoScrollChange` tells you). Put your own controls in `toolbarStart` / `toolbarEnd`, add a Clear button with `onClear`, and use `appearance="dark"` for a terminal-style console in either theme. Keep the list to a sensible length yourself (`.slice(-1000)`): the viewer shows what it is given.',
				},
				{
					example: 2,
				},
				{
					md: '**Log files.** `parseLogFile(text)` turns a log file into entries: every JSON line (winston, pino...) is one entry, and the lines between them that are not JSON, such as a printed `Error` with its stack, are one entry, so a 70-line stack trace is one row. `toLogLevel`, `entryFromRecord` and `formatLogTime` are exported too.',
				},
				{
					example: 3,
				},
			],
		},
		{
			slug: 'fileexplorer',
			name: 'FileExplorer',
			blocks: [
				{
					md: "Browse files and folders. The open folder shows as cards (`grid`) or a table (`list`) with breadcrumbs, a name filter, folders first, sizes and item counts; the `tree` layout shows every folder at once with the keyboard behaviour of `Tree`. A click opens a folder, and calls `onSelect` for a file. `nodes` are `{ id, name, type: 'file' | 'folder', size?, modified?, children?, itemCount? }`. Switch layouts with `view` / `defaultView` / `onViewChange`, and limit them with `views`.",
				},
				{
					example: 1,
				},
				{
					md: "**Folders loaded on demand.** `path` / `defaultPath` hold the open folder as the ids from the root; `onPathChange(path, folder)` fires when the user opens a folder or uses the breadcrumbs, which is where you fetch a folder's `children` (set `itemCount` on a folder that is not loaded yet, and `loading` while you wait). `onRefresh` adds a reload button. Here a click on a file shows it in a full screen `Modal` with `CodeDisplay`; `readableSize`, `languageOf`, `sortNodes` and `describeNode` are exported.",
				},
				{
					example: 2,
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
