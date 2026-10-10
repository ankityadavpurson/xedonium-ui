import { Fragment, useId, useState, type ReactNode } from 'react'
import ChevronDownIcon from './icons/ChevronDown'
import ChevronRightIcon from './icons/ChevronRight'

export interface NestedTableColumn<Row extends object = Record<string, unknown>> {
	key: string
	header: ReactNode
	/** Custom cell content. */
	render?: (row: Row) => ReactNode
	align?: 'left' | 'center' | 'right'
}

export type NestedTableRow<Row extends object = Record<string, unknown>> = Row & {
	/** Rows nested under this one; they show when it is expanded. */
	children?: NestedTableRow<Row>[]
}

export interface NestedTableProps<Row extends object = Record<string, unknown>> {
	columns: NestedTableColumn<Row>[]
	rows: NestedTableRow<Row>[]
	/** Name of the unique field on each row, or a function returning it (default `id`). */
	rowKey?: string | ((row: NestedTableRow<Row>) => string)
	/** Content shown under a row when it is expanded, e.g. the items of an order, or another NestedTable (use `nested`). */
	renderDetails?: (row: NestedTableRow<Row>) => ReactNode
	/** Which rows can expand. By default: rows with `children`, or every row when `renderDetails` is set. */
	canExpand?: (row: NestedTableRow<Row>) => boolean
	/** Initially expanded row keys (uncontrolled). */
	defaultExpanded?: string[]
	/** Expanded row keys (controlled). */
	expanded?: string[]
	onExpandedChange?: (keys: string[]) => void
	/** Called each time a row opens: the place to load its details. */
	onExpand?: (row: NestedTableRow<Row>) => void
	/** Keys of rows whose details are loading: their button shows a spinner and is disabled. */
	loadingKeys?: string[]
	/** Open one row at a time (rows on other levels stay as they are). */
	exclusive?: boolean
	/** Extra buttons for each row, shown in the last column before the expand button. */
	rowActions?: (row: NestedTableRow<Row>, open: boolean) => ReactNode
	/** Where the expand button sits: in the first column (`start`, the default) or in a last column (`end`). */
	expandPosition?: 'start' | 'end'
	/** Header of the last column (when it exists). */
	actionsHeader?: ReactNode
	/** Names a row for the expand button's accessible name (default: its key). */
	rowLabel?: (row: NestedTableRow<Row>) => string
	/** Drop the border and the scroll box, for a table placed inside another table's details. */
	nested?: boolean
	/** Shown when there are no rows. */
	empty?: ReactNode
	/** Screen-reader caption. */
	caption?: string
	className?: string
}

const ALIGN: Record<'left' | 'center' | 'right', string> = {
	left: 'text-left',
	center: 'text-center',
	right: 'text-right',
}

const Spinner = () => (
	<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" strokeWidth="2.5" className="h-4 w-4 animate-spin">
		<circle cx="12" cy="12" r="9" className="stroke-app-border" />
		<path d="M12 3a9 9 0 0 1 9 9" className="stroke-app-strong" />
	</svg>
)

/**
 * Table whose rows expand. A row can hold nested `children` rows (a tree: departments and people), or a details panel
 * from `renderDetails` (master and detail: a bill and its items, even another NestedTable with `nested`), or both.
 * Expansion is uncontrolled (`defaultExpanded`) or controlled (`expanded` + `onExpandedChange`); `exclusive` keeps one row
 * open, `onExpand` and `loadingKeys` support details that load on demand, and `rowActions` adds buttons to each row.
 */
const NestedTable = <Row extends object = Record<string, unknown>>({
	columns,
	rows,
	rowKey = 'id',
	renderDetails,
	canExpand,
	defaultExpanded = [],
	expanded,
	onExpandedChange,
	onExpand,
	loadingKeys = [],
	exclusive = false,
	rowActions,
	expandPosition = 'start',
	actionsHeader = 'More',
	rowLabel,
	nested = false,
	empty = 'No data',
	caption,
	className = '',
}: NestedTableProps<Row>) => {
	const baseId = useId()
	const [innerExpanded, setInnerExpanded] = useState(defaultExpanded)
	const open = expanded ?? innerExpanded
	const keyOf = (row: NestedTableRow<Row>) =>
		typeof rowKey === 'function' ? rowKey(row) : String(row[rowKey as keyof Row])
	const expandable = (row: NestedTableRow<Row>) =>
		canExpand ? canExpand(row) : !!row.children?.length || !!renderDetails

	const setOpen = (next: string[]) => {
		if (expanded === undefined) setInnerExpanded(next)
		onExpandedChange?.(next)
	}

	// rows that share a parent with the row with this key
	const siblingsOf = (items: NestedTableRow<Row>[], key: string): string[] => {
		if (items.some(row => keyOf(row) === key)) return items.map(keyOf)
		for (const row of items) {
			const found = row.children ? siblingsOf(row.children, key) : []
			if (found.length) return found
		}
		return []
	}

	const toggle = (row: NestedTableRow<Row>) => {
		const key = keyOf(row)
		if (open.includes(key)) {
			setOpen(open.filter(item => item !== key))
			return
		}
		const closing = exclusive ? siblingsOf(rows, key) : []
		setOpen([...open.filter(item => !closing.includes(item)), key])
		onExpand?.(row)
	}

	const hasActions = !!rowActions || expandPosition === 'end'
	const columnCount = columns.length + (hasActions ? 1 : 0)

	const button = (row: NestedTableRow<Row>, key: string, isOpen: boolean) => {
		const loading = loadingKeys.includes(key)
		const Chevron = expandPosition === 'end' ? ChevronDownIcon : ChevronRightIcon
		return (
			<button
				type="button"
				aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${rowLabel ? rowLabel(row) : key}`}
				aria-expanded={isOpen}
				aria-controls={isOpen ? `${baseId}-${key}` : undefined}
				disabled={loading}
				onClick={() => toggle(row)}
				className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-app-muted outline-none transition hover:text-app-text focus-visible:ring-2 focus-visible:ring-app-strong disabled:cursor-wait"
			>
				{loading ? (
					<Spinner />
				) : (
					<Chevron
						className={`h-4 w-4 transition-transform ${
							isOpen ? (expandPosition === 'end' ? 'rotate-180' : 'rotate-90') : ''
						}`}
					/>
				)}
			</button>
		)
	}

	const renderRows = (items: NestedTableRow<Row>[], depth = 0): ReactNode =>
		items.map(row => {
			const key = keyOf(row)
			const can = expandable(row)
			const isOpen = can && open.includes(key)
			const cell = (column: NestedTableColumn<Row>) =>
				column.render ? column.render(row) : (row[column.key as keyof Row] as ReactNode)

			return (
				<Fragment key={key}>
					<tr className="border-b border-app-border last:border-b-0 hover:bg-app-bg">
						{columns.map((column, index) => (
							<td key={column.key} className={`px-4 py-2.5 ${ALIGN[column.align ?? 'left']}`}>
								{index === 0 && expandPosition === 'start' ? (
									<span className="inline-flex items-center gap-2" style={{ paddingLeft: `${depth * 1.25}rem` }}>
										{can ? (
											button(row, key, isOpen)
										) : (
											<span aria-hidden="true" className="inline-block h-6 w-6 shrink-0" />
										)}
										{cell(column)}
									</span>
								) : index === 0 && depth > 0 ? (
									<span style={{ paddingLeft: `${depth * 1.25}rem` }}>{cell(column)}</span>
								) : (
									cell(column)
								)}
							</td>
						))}
						{hasActions && (
							<td className="px-4 py-2.5 text-right">
								<span className="inline-flex items-center justify-end gap-1">
									{rowActions?.(row, isOpen)}
									{expandPosition === 'end' &&
										(can ? button(row, key, isOpen) : <span className="inline-block h-6 w-6" />)}
								</span>
							</td>
						)}
					</tr>
					{isOpen && renderDetails && (
						<tr id={`${baseId}-${key}`} className="border-b border-app-border">
							<td colSpan={columnCount} className="p-0">
								<div className="flex flex-col gap-3 bg-app-bg/50 px-4 py-4">{renderDetails(row)}</div>
							</td>
						</tr>
					)}
					{isOpen && row.children && renderRows(row.children, depth + 1)}
				</Fragment>
			)
		})

	const table = (
		<table className="w-full border-collapse bg-app-card text-sm text-app-text">
			{caption && <caption className="sr-only">{caption}</caption>}
			<thead>
				<tr className="border-b border-app-border bg-app-bg">
					{columns.map(column => (
						<th
							key={column.key}
							scope="col"
							className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-app-muted ${ALIGN[column.align ?? 'left']}`}
						>
							{column.header}
						</th>
					))}
					{hasActions && (
						<th
							scope="col"
							className="px-4 py-2.5 text-right text-xs font-semibold uppercase tracking-widest text-app-muted"
						>
							{actionsHeader}
						</th>
					)}
				</tr>
			</thead>
			<tbody>
				{rows.length === 0 ? (
					<tr>
						<td colSpan={Math.max(columnCount, 1)} className="px-4 py-6 text-center text-app-muted">
							{empty}
						</td>
					</tr>
				) : (
					renderRows(rows)
				)}
			</tbody>
		</table>
	)

	return nested ? (
		<div className={className}>{table}</div>
	) : (
		<div className={`overflow-x-auto border border-app-border ${className}`}>{table}</div>
	)
}

export default NestedTable
