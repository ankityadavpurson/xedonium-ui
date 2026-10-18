import { useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import Checkbox from './Checkbox'
import Input from './Input'
import Pagination from './Pagination'
import Skeleton from './Skeleton'
import SortIcon from './icons/Sort'

export interface DataGridColumn<Row extends object = Record<string, unknown>> {
	key: string
	header: ReactNode
	sortable?: boolean
	/** Custom cell content. */
	render?: (row: Row) => ReactNode
	align?: 'left' | 'center' | 'right'
	/** Supplies the value used for sorting and search. */
	accessor?: (row: Row) => unknown
	/** Extra classes for this column's body cells. */
	className?: string
	/** Extra classes for this column's header cell. */
	headerClassName?: string
	/** Column width: a number (px) or any CSS length. */
	width?: number | string
	minWidth?: number | string
	/** Hide the column below this breakpoint (so wide tables fit on phones). */
	hideBelow?: 'sm' | 'md' | 'lg'
}

export interface DataGridProps<Row extends object = Record<string, unknown>> {
	columns: DataGridColumn<Row>[]
	rows: Row[]
	/** Name of the unique field on each row (default `id`). */
	rowKey?: string
	/** Rows per page (the starting size when `pageSizeOptions` is set). */
	pageSize?: number
	/** E.g. `[10, 25, 50]`: lets the user change the page size. */
	pageSizeOptions?: number[]
	onPageSizeChange?: (size: number) => void
	searchable?: boolean
	/** Row selection with checkboxes (uncontrolled). */
	selectable?: boolean
	/** Selected row keys (controlled). */
	selected?: (string | number)[]
	onSelectionChange?: (keys: (string | number)[]) => void
	/** Shows skeleton rows instead of the data and sets `aria-busy`. */
	loading?: boolean
	/** Hide the footer (row count, page size select, pager) when all `rows` fit on one page. */
	hideFooterWhenSinglePage?: boolean
	/**
	 * Render only the rows in view (plus a few more) inside a scrolling area, for thousands of rows. Rows must have a
	 * fixed height (`rowHeight`). All rows then scroll in one list with a sticky header; pass `pageSize` to page them too.
	 */
	virtualized?: boolean
	/** Row height in px when `virtualized` (default 40). Cell content must fit in it; it is not wrapped. */
	rowHeight?: number
	/** Height in px of the scrolling area when `virtualized` (default 400); it is shorter when there are few rows. */
	height?: number
	empty?: ReactNode
	caption?: string
	className?: string
}

type Sort = { key: string; dir: 'asc' | 'desc' }

const valueOf = <Row extends object>(row: Row, column: DataGridColumn<Row>) =>
	column.accessor ? column.accessor(row) : row[column.key as keyof Row]

const ALIGN: Record<'left' | 'center' | 'right', string> = {
	left: 'text-left',
	center: 'text-center',
	right: 'text-right',
}

const HIDE_BELOW: Record<'sm' | 'md' | 'lg', string> = {
	sm: 'hidden sm:table-cell',
	md: 'hidden md:table-cell',
	lg: 'hidden lg:table-cell',
}

const columnClass = <Row extends object>(column: DataGridColumn<Row>, extra?: string) =>
	`${ALIGN[column.align ?? 'left']} ${column.hideBelow ? HIDE_BELOW[column.hideBelow] : ''} ${extra ?? ''}`

const columnStyle = <Row extends object>(column: DataGridColumn<Row>): CSSProperties | undefined =>
	column.width === undefined && column.minWidth === undefined
		? undefined
		: { width: column.width, minWidth: column.minWidth }

// Extra rows rendered above and below the visible window when virtualized
const OVERSCAN = 6

// Sticky header cells (the bar stays while the rows scroll); the inset shadow draws the line a collapsed border can't
const STICKY = 'sticky top-0 z-10 bg-app-bg shadow-[inset_0_-1px_0_0_rgb(var(--color-app-border))]'

const compare = (a: unknown, b: unknown) => {
	if (a == null) return b == null ? 0 : 1
	if (b == null) return -1
	if (typeof a === 'number' && typeof b === 'number') return a - b
	return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
}

// Empty row standing in for the rows outside the window, so the scroll bar has the full height
const Spacer = ({ height, columns }: { height: number; columns: number }) => (
	<tr aria-hidden="true" style={{ height }}>
		<td colSpan={columns} className="p-0" />
	</tr>
)

/**
 * Table with client-side sorting, search, pagination and row selection.
 * columns: [{ key, header, sortable?, render?(row), align?, accessor?(row), className?, headerClassName?, width?,
 * minWidth?, hideBelow? }] (`accessor` supplies the sort / search value; `hideBelow: 'sm' | 'md' | 'lg'` hides the column
 * on smaller screens).
 * `pageSize` is the rows per page; add `pageSizeOptions` (e.g. [10, 25, 50]) to let the user change it, starting from
 * `pageSize` (`onPageSizeChange(size)` is called on each change).
 * `hideFooterWhenSinglePage` hides the footer while `rows.length <= pageSize` (the current page size).
 * `loading` replaces the rows with skeleton placeholders (up to 5) and marks the table busy.
 * `virtualized` renders only the visible rows (fixed `rowHeight`, scroll area `height`), so tens of thousands of rows
 * stay fast; all rows scroll in one list unless `pageSize` is set. Sorting, search and selection work on every row.
 * Selection is controlled with `selected` (array of row keys) + `onSelectionChange`, or uncontrolled with `selectable`.
 */
const DataGrid = <Row extends object = Record<string, unknown>>({
	columns,
	rows,
	rowKey = 'id',
	pageSize: pageSizeProp,
	pageSizeOptions,
	onPageSizeChange,
	searchable = false,
	selectable = false,
	selected,
	onSelectionChange,
	loading = false,
	hideFooterWhenSinglePage = false,
	virtualized = false,
	rowHeight = 40,
	height = 400,
	empty = 'No results',
	caption,
	className = '',
}: DataGridProps<Row>) => {
	const [sort, setSort] = useState<Sort | null>(null)
	const [query, setQuery] = useState('')
	const [page, setPage] = useState(1)
	const [chosenSize, setChosenSize] = useState<number | null>(null)
	// Virtualized grids scroll all rows in one list, unless the page size is asked for explicitly
	const paged = !virtualized || pageSizeProp !== undefined || !!pageSizeOptions
	const pageSize = pageSizeProp ?? 10
	const [scrollTop, setScrollTop] = useState(0)
	const [innerSelected, setInnerSelected] = useState<(string | number)[]>([])
	const selection = selected ?? innerSelected

	const keyOf = (row: Row) => row[rowKey as keyof Row] as string | number

	const processed = useMemo(() => {
		const needle = query.trim().toLowerCase()
		let result = needle
			? rows.filter(row =>
					columns.some(column =>
						String(valueOf(row, column) ?? '')
							.toLowerCase()
							.includes(needle)
					)
				)
			: rows
		if (sort) {
			const column = columns.find(c => c.key === sort.key) as DataGridColumn<Row>
			result = [...result].sort(
				(a, b) => compare(valueOf(a, column), valueOf(b, column)) * (sort.dir === 'asc' ? 1 : -1)
			)
		}
		return result
	}, [rows, columns, query, sort])

	const size = paged ? (pageSizeOptions ? (chosenSize ?? pageSize) : pageSize) : Math.max(processed.length, 1)
	const pageCount = Math.max(1, Math.ceil(processed.length / size))
	const currentPage = Math.min(page, pageCount)
	const visible = processed.slice((currentPage - 1) * size, currentPage * size)

	const setSelection = (next: (string | number)[]) => {
		if (selected === undefined) setInnerSelected(next)
		onSelectionChange?.(next)
	}
	const visibleKeys = visible.map(keyOf)
	const selectedSet = new Set(selection)
	const allChecked = visibleKeys.length > 0 && visibleKeys.every(key => selectedSet.has(key))
	const someChecked = visibleKeys.some(key => selectedSet.has(key))

	// The rows actually rendered: the window around the scroll position when virtualized
	const windowStart = virtualized ? Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN) : 0
	const windowEnd = virtualized
		? Math.min(visible.length, Math.ceil((scrollTop + height) / rowHeight) + OVERSCAN)
		: visible.length
	const rendered = virtualized ? visible.slice(windowStart, windowEnd) : visible
	const columnCount = columns.length + (selectable ? 1 : 0)
	// Fixed-height rows: no vertical padding, one line, ellipsis
	const cellY = virtualized ? 'py-0 whitespace-nowrap overflow-hidden text-ellipsis' : 'py-2.5'

	const toggleSort = (column: DataGridColumn<Row>) => {
		setPage(1)
		setSort(current =>
			current?.key !== column.key
				? { key: column.key, dir: 'asc' }
				: current.dir === 'asc'
					? { key: column.key, dir: 'desc' }
					: null
		)
	}

	return (
		<div className={`flex flex-col gap-3 ${className}`}>
			{searchable && (
				<div className="max-w-xs">
					<Input
						value={query}
						onChange={value => {
							setQuery(value)
							setPage(1)
						}}
						placeholder="Search…"
						aria-label="Search rows"
						type="search"
					/>
				</div>
			)}
			<div
				className={`border border-app-border ${virtualized ? 'overflow-auto' : 'overflow-x-auto'}`}
				style={virtualized ? { maxHeight: height } : undefined}
				onScroll={virtualized ? event => setScrollTop(event.currentTarget.scrollTop) : undefined}
				{...(virtualized ? { tabIndex: 0, role: 'region', 'aria-label': caption ?? 'Table' } : {})}
			>
				<table
					aria-busy={loading || undefined}
					aria-rowcount={virtualized ? visible.length + 1 : undefined}
					className="w-full border-collapse bg-app-card text-sm text-app-text"
				>
					{caption && <caption className="sr-only">{caption}</caption>}
					<thead>
						<tr className="border-b border-app-border bg-app-bg">
							{selectable && (
								<th scope="col" className={`w-10 px-4 py-2.5 ${virtualized ? STICKY : ''}`}>
									<Checkbox
										aria-label={paged ? 'Select all rows on this page' : 'Select all rows'}
										checked={allChecked}
										indeterminate={!allChecked && someChecked}
										onChange={checked =>
											setSelection(
												checked
													? [...new Set([...selection, ...visibleKeys])]
													: selection.filter(key => !visibleKeys.includes(key))
											)
										}
									/>
								</th>
							)}
							{columns.map(column => {
								const active = sort?.key === column.key
								return (
									<th
										key={column.key}
										scope="col"
										aria-sort={
											active ? (sort?.dir === 'asc' ? 'ascending' : 'descending') : column.sortable ? 'none' : undefined
										}
										style={columnStyle(column)}
										className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-app-muted ${virtualized ? STICKY : ''} ${columnClass(column, column.headerClassName)}`}
									>
										{column.sortable ? (
											<button
												type="button"
												onClick={() => toggleSort(column)}
												className="-my-2 inline-flex min-h-8 items-center gap-1 uppercase tracking-widest transition hover:text-app-text"
											>
												{column.header}
												<SortIcon direction={active ? sort?.dir : undefined} />
											</button>
										) : (
											column.header
										)}
									</th>
								)
							})}
						</tr>
					</thead>
					<tbody>
						{loading ? (
							Array.from({ length: Math.min(size, 5) }, (_, index) => (
								<tr key={index} className="border-b border-app-border last:border-b-0">
									{Array.from({ length: columnCount }, (_, cell) => (
										<td key={cell} className="px-4 py-3">
											<Skeleton className="h-4 w-full" />
										</td>
									))}
								</tr>
							))
						) : visible.length === 0 ? (
							<tr>
								<td colSpan={columnCount} className="px-4 py-6 text-center text-app-muted">
									{empty}
								</td>
							</tr>
						) : (
							<>
								{virtualized && windowStart > 0 && <Spacer height={windowStart * rowHeight} columns={columnCount} />}
								{rendered.map((row, offset) => {
									const key = keyOf(row)
									const checked = selectedSet.has(key)
									return (
										<tr
											key={key}
											aria-selected={selectable ? checked : undefined}
											aria-rowindex={virtualized ? windowStart + offset + 2 : undefined}
											style={virtualized ? { height: rowHeight } : undefined}
											className={`border-b border-app-border last:border-b-0 hover:bg-app-bg ${checked ? 'bg-app-soft/10' : ''}`}
										>
											{selectable && (
												<td className={`px-4 ${cellY}`}>
													<Checkbox
														aria-label={`Select row ${key}`}
														checked={checked}
														onChange={on => setSelection(on ? [...selection, key] : selection.filter(k => k !== key))}
													/>
												</td>
											)}
											{columns.map(column => (
												<td
													key={column.key}
													style={columnStyle(column)}
													className={`px-4 ${cellY} ${columnClass(column, column.className)}`}
												>
													{column.render ? column.render(row) : (row[column.key as keyof Row] as ReactNode)}
												</td>
											))}
										</tr>
									)
								})}
								{virtualized && windowEnd < visible.length && (
									<Spacer height={(visible.length - windowEnd) * rowHeight} columns={columnCount} />
								)}
							</>
						)}
					</tbody>
				</table>
			</div>
			{!(hideFooterWhenSinglePage && rows.length <= size) && (
				<div className="flex flex-wrap items-center justify-between gap-3 text-xs text-app-muted">
					<span aria-live="polite">
						{loading ? (
							'Loading…'
						) : (
							<>
								{processed.length} {processed.length === 1 ? 'row' : 'rows'}
								{selectable && selection.length > 0 ? `, ${selection.length} selected` : ''}
							</>
						)}
					</span>
					{(pageCount > 1 || pageSizeOptions) && (
						<Pagination
							page={currentPage}
							pageCount={pageCount}
							onChange={setPage}
							pageSize={size}
							pageSizeOptions={pageSizeOptions}
							onPageSizeChange={next => {
								setChosenSize(next)
								setPage(1)
								onPageSizeChange?.(next)
							}}
						/>
					)}
				</div>
			)}
		</div>
	)
}

export default DataGrid
