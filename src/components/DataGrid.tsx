import { useMemo, useState, type ReactNode } from 'react'
import Checkbox from './Checkbox'
import Input from './Input'
import Pagination from './Pagination'
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

const compare = (a: unknown, b: unknown) => {
	if (a == null) return b == null ? 0 : 1
	if (b == null) return -1
	if (typeof a === 'number' && typeof b === 'number') return a - b
	return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' })
}

/**
 * Table with client-side sorting, search, pagination and row selection.
 * columns: [{ key, header, sortable?, render?(row), align?, accessor?(row) }] (`accessor` supplies the sort / search value).
 * `pageSize` is the rows per page; add `pageSizeOptions` (e.g. [10, 25, 50]) to let the user change it, starting from
 * `pageSize` (`onPageSizeChange(size)` is called on each change).
 * Selection is controlled with `selected` (array of row keys) + `onSelectionChange`, or uncontrolled with `selectable`.
 */
const DataGrid = <Row extends object = Record<string, unknown>>({
	columns,
	rows,
	rowKey = 'id',
	pageSize = 10,
	pageSizeOptions,
	onPageSizeChange,
	searchable = false,
	selectable = false,
	selected,
	onSelectionChange,
	empty = 'No results',
	caption,
	className = '',
}: DataGridProps<Row>) => {
	const [sort, setSort] = useState<Sort | null>(null)
	const [query, setQuery] = useState('')
	const [page, setPage] = useState(1)
	const [chosenSize, setChosenSize] = useState<number | null>(null)
	const size = pageSizeOptions ? (chosenSize ?? pageSize) : pageSize
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

	const pageCount = Math.max(1, Math.ceil(processed.length / size))
	const currentPage = Math.min(page, pageCount)
	const visible = processed.slice((currentPage - 1) * size, currentPage * size)

	const setSelection = (next: (string | number)[]) => {
		if (selected === undefined) setInnerSelected(next)
		onSelectionChange?.(next)
	}
	const visibleKeys = visible.map(keyOf)
	const allChecked = visibleKeys.length > 0 && visibleKeys.every(key => selection.includes(key))
	const someChecked = visibleKeys.some(key => selection.includes(key))

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
			<div className="overflow-x-auto border border-app-border">
				<table className="w-full border-collapse bg-app-card text-sm text-app-text">
					{caption && <caption className="sr-only">{caption}</caption>}
					<thead>
						<tr className="border-b border-app-border bg-app-bg">
							{selectable && (
								<th scope="col" className="w-10 px-4 py-2.5">
									<Checkbox
										aria-label="Select all rows on this page"
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
										className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-app-muted ${ALIGN[column.align ?? 'left']}`}
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
						{visible.length === 0 ? (
							<tr>
								<td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-6 text-center text-app-muted">
									{empty}
								</td>
							</tr>
						) : (
							visible.map(row => {
								const key = keyOf(row)
								const checked = selection.includes(key)
								return (
									<tr
										key={key}
										aria-selected={selectable ? checked : undefined}
										className={`border-b border-app-border last:border-b-0 hover:bg-app-bg ${checked ? 'bg-app-soft/10' : ''}`}
									>
										{selectable && (
											<td className="px-4 py-2.5">
												<Checkbox
													aria-label={`Select row ${key}`}
													checked={checked}
													onChange={on => setSelection(on ? [...selection, key] : selection.filter(k => k !== key))}
												/>
											</td>
										)}
										{columns.map(column => (
											<td key={column.key} className={`px-4 py-2.5 ${ALIGN[column.align ?? 'left']}`}>
												{column.render ? column.render(row) : (row[column.key as keyof Row] as ReactNode)}
											</td>
										))}
									</tr>
								)
							})
						)}
					</tbody>
				</table>
			</div>
			<div className="flex flex-wrap items-center justify-between gap-3 text-xs text-app-muted">
				<span aria-live="polite">
					{processed.length} {processed.length === 1 ? 'row' : 'rows'}
					{selectable && selection.length > 0 ? `, ${selection.length} selected` : ''}
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
		</div>
	)
}

export default DataGrid
